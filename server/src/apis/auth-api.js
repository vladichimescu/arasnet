import jwt from "jsonwebtoken"

import { encrypt, validateRequiredFields, verify } from "@arasnet/functions"
import {
  apiEmployeesEndpoint,
  apiPartnerEndpoint,
  apiPrepEndpoint,
  apiTestingEndpoint,
} from "@arasnet/types"

import jsonServerDB from "../index.js"

const secret = process.env.SECRET
const serverHostname = process.env.SERVER_HOSTNAME
const port = process.env.SERVER_PORT
const isHttps = process.env.HTTPS

const apiEndpoints = [
  apiTestingEndpoint,
  apiEmployeesEndpoint,
  apiPrepEndpoint,
  apiPartnerEndpoint,
]

const actions = {
  POST: "create",
  GET: "read",
  PUT: "update",
  PATCH: "update",
  DELETE: "remove",
}

function authenticate({ headers: { authorization = "" } = {} }, res, next) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send("authentication_failed")
  }

  jwt.verify(token, secret, function (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send("authentication_expired")
      }

      return res.status(401).send("authentication_failed")
    }

    const { email: userEmail, password: userPassword } = jwt.decode(token)

    const dbUser = jsonServerDB.employees.find(
      ({ email: employeeEmail, password: employeePassword } = {}) =>
        employeeEmail === userEmail && employeePassword === userPassword
    )

    if (!dbUser) {
      return res.status(401).send("authentication_failed")
    }

    next()
  })
}

function authorize(
  { headers: { authorization = "" } = {}, originalUrl, method, query, body },
  res,
  next
) {
  const token = authorization.split(" ")[1]

  jwt.verify(token, secret, function (err) {
    const { email: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB.employees.find(
      ({ email: employeeEmail } = {}) => employeeEmail === userEmail
    )

    const api = apiEndpoints.find((path) => originalUrl.startsWith(`/${path}`))
    const action = actions[method]

    const userApiPermissions = dbUser.permissions[api]

    const [permittedAction, ...filters] =
      userApiPermissions.find(
        ([permittedAction]) => permittedAction === action
      ) || []

    if (!permittedAction) {
      if (query.isPublic) {
        res.locals.isPublicAuthorized = true
      } else {
        return res.status(403).send("authorization_failed")
      }
    }

    if (action === "read") {
      filters.forEach(([key, value]) => {
        query[key] = value
      })
    } else {
      const payloadPermitted = filters.every(([key, value]) =>
        value.includes(body[key])
      )

      if (!payloadPermitted) {
        return res.status(403).send("authorization_failed")
      }
    }

    if (action === "create") {
      body.createdBy = userEmail
    }

    if (action === "update") {
      body.updatedBy = userEmail
    }

    next()
  })
}

async function login({ body: { email, password } = {} }, res) {
  const errors = validateRequiredFields({ email, password }, [
    "email",
    "password",
  ])

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const dbEmployee = jsonServerDB.employees.find(
    ({ email: employeeEmail } = {}) => employeeEmail === email
  )

  if (!dbEmployee) {
    return res.status(400).send({
      email: "email_invalid",
    })
  }

  if (dbEmployee.password) {
    const isPasswordValid = await verify(dbEmployee.password, password)

    if (!isPasswordValid) {
      return res.status(400).send({
        password: "password_invalid",
      })
    }
  } else {
    const { email: adminEmail, password: adminPassword } =
      jsonServerDB.employees.find(
        ({ email: employeeEmail } = {}) => employeeEmail === "admin@arasnet.ro"
      )

    try {
      const response = await fetch(
        `${isHttps ? "https" : "http"}://${serverHostname}:${port}/employees/${dbEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt.sign(
              {
                email: adminEmail,
                password: adminPassword,
              },
              secret,
              {
                expiresIn: "1d",
              }
            )}`,
          },
          body: JSON.stringify({
            ...dbEmployee,
            password: await encrypt(password),
          }),
        }
      )

      if ([4, 5].includes(parseInt(res.statusCode / 100))) {
        const errors = await response.json()

        return res.status(response.status).send(errors)
      }
    } catch (err) {
      return res
        .status(500)
        .send("server_error", err.cause?.message || err.message)
    }
  }

  const hasPermissions = Object.values(dbEmployee.permissions).some(
    (permissions) => permissions.length
  )

  if (!hasPermissions) {
    return res.status(403).send("permissions_error")
  }

  const token = jwt.sign(
    {
      email,
      password: dbEmployee.password,
    },
    secret,
    {
      expiresIn: "1d",
    }
  )

  return res.status(200).send({
    token,
    user: {
      email,
      name: `${dbEmployee.firstName} ${dbEmployee.lastName}`.trim(),
    },
    permissions: dbEmployee.permissions,
  })
}

function resign({ headers: { authorization = "" } = {} }, res) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send("authentication_failed")
  }

  jwt.verify(token, secret, function (err) {
    if (err && err.name !== "TokenExpiredError") {
      return res.status(401).send("authentication_failed")
    }

    const { email: userEmail, password: userPassword } = jwt.decode(token)

    const dbUser = jsonServerDB.employees.find(
      ({ email: employeeEmail, password: employeePassword } = {}) =>
        employeeEmail === userEmail && employeePassword === userPassword
    )

    if (!dbUser) {
      return res.status(401).send("authentication_failed")
    }

    const newToken = jwt.sign(
      {
        email: userEmail,
        password: userPassword,
      },
      secret,
      {
        expiresIn: "1d",
      }
    )

    return res.status(200).send({
      token: newToken,
      permissions: dbUser.permissions,
    })
  })
}

function restart({ headers: { authorization = "" } = {} }, res) {
  const token = authorization.split(" ")[1]

  jwt.verify(token, secret, function (err) {
    const { email: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB.employees.find(
      ({ email: employeeEmail } = {}) => employeeEmail === userEmail
    )

    if (dbUser?.createdBy !== "SYSTEM") {
      return res.status(403).send("authorization_failed")
    }

    res.status(200).send()

    setTimeout(() => {
      process.exit()
    }, 50)
  })
}

const AuthApi = { authenticate, authorize, login, resign, restart }

export default AuthApi
