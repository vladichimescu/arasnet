import jsonServerDB from "../index.js"
import { mandatoryPropsCheck } from "../libs/mandatory-props-check.js"

const employeeMandatoryFields = process.env.EMPLOYEE_MANDATORY_FIELDS.split(",")

function registerEmployee({ body: employee = {} }, res, next) {
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

function infoEmployee({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  next()
}

function updateEmployee({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  const errors = mandatoryPropsCheck(employee, employeeMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function deleteEmployee({ body: employee = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  next()
}

export { registerEmployee, infoEmployee, updateEmployee, deleteEmployee }
