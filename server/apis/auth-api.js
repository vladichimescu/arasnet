import jwt from "jsonwebtoken"

import { validateRequiredFields, verify } from "@arasnet/functions"
import { apiConsultationsEndpoint, apiEmployeesEndpoint } from "@arasnet/types"

import jsonServerDB from "../index.js"

const secret = process.env.SECRET

const apiEndpoints = [apiConsultationsEndpoint, apiEmployeesEndpoint]

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

    const { data: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB
      .getState()
      .employees.find(
        ({ email: employeeEmail } = {}) => employeeEmail === userEmail
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
    const { data: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB
      .getState()
      .employees.find(
        ({ email: employeeEmail } = {}) => employeeEmail === userEmail
      )

    const api = apiEndpoints.find((path) => originalUrl.startsWith(`/${path}`))
    const action = actions[method]

    const userApiPermissions = dbUser.permissions[api]

    const [permittedAction, ...filters] = userApiPermissions.find(
      ([permittedAction]) => permittedAction === action
    )

    if (!permittedAction) {
      return res.status(403).send("authorization_failed")
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

  const dbEmployee = jsonServerDB
    .getState()
    .employees.find(({ email: employeeEmail } = {}) => employeeEmail === email)

  if (!dbEmployee) {
    return res.status(400).send({
      email: "email_invalid",
    })
  }

  const isPasswordValid = await verify(dbEmployee.password, password)

  if (!isPasswordValid) {
    return res.status(400).send({
      password: "password_invalid",
    })
  }

  const token = jwt.sign(
    {
      data: email,
    },
    secret,
    {
      expiresIn: "30s",
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

    const { data: userEmail } = jwt.decode(token)

    const newToken = jwt.sign(
      {
        data: userEmail,
      },
      secret,
      {
        expiresIn: "30s",
      }
    )

    const dbUser = jsonServerDB
      .getState()
      .employees.find(
        ({ email: employeeEmail } = {}) => employeeEmail === userEmail
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
    const { data: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB
      .getState()
      .employees.find(
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
