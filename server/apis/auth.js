import jwt from "jsonwebtoken"

import jsonServerDB from "../index.js"

const secret = process.env.SECRET

function auth({ headers }, res, next) {
  const bearer = headers?.authorization || ""
  const token = bearer.split(" ")[1]

  if (!token) {
    return res.status(401).send({
      code: "unauthenticated",
      message: "not authenticated",
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err) {
      return res.status(401).send({
        code: "authentication_failed",
        message: "authentication failed",
      })
    }

    const { data: userEmail } = jwt.decode(token)

    const dbEmployee = jsonServerDB
      .getState()
      .employees.find(({ email } = {}) => email === userEmail)

    if (!dbEmployee) {
      return res.status(401).send({
        code: "authentication_failed",
        message: "authentication failed",
      })
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
        code: "email_invalid",
        message: "email invalid",
      },
    })
  }

  const isPasswordValid = dbEmployee.password === employee.password
  if (!isPasswordValid) {
    return res.status(400).send({
      password: {
        code: "password_invalid",
        message: "password invalid",
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

  return res.status(200).send({ token })
}

function resign({ headers: { authorization: bearer = "" } = {} }, res) {
  const token = bearer.split(" ")[1]

  if (!token) {
    return res.status(400).send({
      token: {
        code: "token_required",
        message: "token required",
      },
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err && err.name !== "TokenExpiredError") {
      return res.status(400).send({
        token: {
          code: "token_invalid",
          message: "token invalid",
        },
      })
    }

    const decodedToken = jwt.decode(token)
    const newToken = jwt.sign(
      {
        data: decodedToken.data,
      },
      secret,
      {
        expiresIn: "12h",
      }
    )

    return res.status(200).send({ token: newToken })
  })
}

export { auth, login, resign }
