import jsonServerDB from "../index.js"
import { mandatoryPropsCheck } from "../libs/mandatory-props-check.js"

const employeeMandatoryFields = process.env.EMPLOYEE_MANDATORY_FIELDS.split(",")

function create({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  const errors = mandatoryPropsCheck(employee, employeeMandatoryFields)

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
  // TODO: based on user permissions, apply filters if not present already

  next()
}

function update({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  const errors = mandatoryPropsCheck(employee, employeeMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  next()
}

const EmployeesApi = {
  create,
  read,
  update,
  remove,
}

export default EmployeesApi
