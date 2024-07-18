import jwt from "jsonwebtoken"

import { locations } from "@arasnet/types"

import jsonServerDB from "../index.js"

const secret = process.env.SECRET

const apis = [
  process.env.SERVER_PATH_EMPLOYEES,
  process.env.SERVER_PATH_CONSULTATIONS,
]

const actions = {
  GET: "read",
  POST: "create",
  PUT: "update",
  DELETE: "delete",
  PATCH: "update",
}

function authenticate({ headers: { authorization = "" } = {} }, res, next) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send({
      code: "authentication failed",
      message: "Authentication has failed",
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({
          code: "authentication expired",
          message: "Authentication has expired",
        })
      }

      return res.status(401).send({
        code: "authentication failed",
        message: "Authentication has failed",
      })
    }

    const { data: userEmail } = jwt.decode(token)

    const dbUser = jsonServerDB
      .getState()
      .employees.find(({ email } = {}) => email === userEmail)

    if (!dbUser) {
      return res.status(401).send({
        code: "authentication failed",
        message: "Authentication has failed",
      })
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
      .employees.find(({ email } = {}) => email === userEmail)

    const api = apis.find((path) => originalUrl.startsWith(`/${path}`))
    const action = actions[method]

    const permittedLocations = Object.keys(dbUser.permissions).filter(
      (location) =>
        Object.keys(locations).includes(location) &&
        dbUser.permissions[location][api].includes(action)
    )

    if (permittedLocations.length === 0) {
      return res.status(403).send({
        code: "authorization failed",
        message: "Authorization has failed",
      })
    }

    const locationFilters =
      permittedLocations.length === Object.keys(locations).length
        ? []
        : ["location", permittedLocations]

    const filters = [...locationFilters]

    if (action === "read") {
      filters.forEach(([key, value]) => {
        query[key] = value
      })
    } else {
      const payloadPermitted = filters.every(([key, value]) =>
        value.includes(body[key])
      )

      if (!payloadPermitted) {
        return res.status(403).send({
          code: "authorization failed",
          message: "Authorization has failed",
        })
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

function login({ body: employee = {} }, res) {
  const dbEmployee = jsonServerDB
    .getState()
    .employees.find(({ email } = {}) => email === employee.email)

  if (!dbEmployee) {
    return res.status(400).send({
      email: {
        code: "email invalid",
        message: "Email is invalid",
      },
    })
  }

  const isPasswordValid = dbEmployee.password === employee.password

  if (!isPasswordValid) {
    return res.status(400).send({
      password: {
        code: "password invalid",
        message: "Password is invalid",
      },
    })
  }

  const token = jwt.sign(
    {
      data: employee.email,
    },
    secret,
    {
      expiresIn: "1h",
    }
  )

  return res.status(200).send({
    token,
    permissions: dbEmployee.permissions,
  })
}

function resign({ headers: { authorization = "" } = {} }, res) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send({
      code: "authentication failed",
      message: "Authentication has failed",
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err && err.name !== "TokenExpiredError") {
      return res.status(401).send({
        code: "authentication failed",
        message: "Authentication has failed",
      })
    }

    const decodedToken = jwt.decode(token)
    const newToken = jwt.sign(
      {
        data: decodedToken.data,
      },
      secret,
      {
        expiresIn: "1h",
      }
    )

    return res.status(200).send(newToken)
  })
}

const AuthApi = { authenticate, authorize, login, resign }

export default AuthApi
