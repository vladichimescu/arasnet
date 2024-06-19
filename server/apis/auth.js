import jwt from "jsonwebtoken"

import jsonServerDB from "../index.js"

const secret = process.env.SECRET

function auth({ headers: { authorization = "" } = {} }, res, next) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send({
      code: "authentication_failed",
      message: "authentication failed",
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({
          code: "authentication_expired",
          message: "authentication expired",
        })
      }

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

function resign({ headers: { authorization = "" } = {} }, res) {
  const token = authorization.split(" ")[1]

  if (!token) {
    return res.status(401).send({
      code: "authentication_failed",
      message: "authentication failed",
    })
  }

  jwt.verify(token, secret, function (err) {
    if (err && err.name !== "TokenExpiredError") {
      return res.status(401).send({
        code: "authentication_failed",
        message: "authentication failed",
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

    return res.status(200).send({ token: newToken })
  })
}

export { auth, login, resign }
