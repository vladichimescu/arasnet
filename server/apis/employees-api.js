import jsonServerDB from "../index.js"
import { checkMandatoryProps } from "../libs/check-mandatory-props.js"

const employeeMandatoryFields = process.env.EMPLOYEE_MANDATORY_FIELDS.split(",")

function create({ body: employee = {} }, res, next) {
  const errors = checkMandatoryProps(employee, employeeMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const dbEmployee = jsonServerDB
    .getState()
    .employees.find(({ email } = {}) => email === employee.email)

  if (dbEmployee) {
    return res.status(400).send({
      email: {
        code: "email_invalid",
        message: "email already used",
      },
    })
  }

  next()
}

function read({ body: employee = {} }, res, next) {
  next()
}

function update({ body: employee = {} }, res, next) {
  const errors = checkMandatoryProps(employee, employeeMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: employee = {} }, res, next) {
  next()
}

const EmployeesApi = {
  GET: read,
  POST: create,
  PUT: update,
  DELETE: remove,
  //TODO: check PATCH
  // PATCH: update,
  middleware: (req, res, next) => EmployeesApi[req.method](req, res, next),
}

export default EmployeesApi
