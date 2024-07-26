import jwt from "jsonwebtoken"

import { validateRequiredFields } from "@arasnet/functions"
import {
  apiActions,
  apiEndpoints,
  employeeRequiredFields,
  locations,
} from "@arasnet/types"

import jsonServerDB from "../index.js"

function create({ body: employee = {} }, res, next) {
  const errors = validateRequiredFields(employee, employeeRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const dbEmployeeByEmail = jsonServerDB
    .getState()
    .employees.find(
      ({ email: employeeEmail } = {}) => employeeEmail === employee.email
    )

  if (dbEmployeeByEmail) {
    return res.status(400).send({
      email: {
        code: "email invalid",
        message: "Email is already used",
      },
    })
  }

  const dbEmployeeByPhone = jsonServerDB
    .getState()
    .employees.find(({ phone } = {}) => phone === employee.phone)

  if (dbEmployeeByPhone) {
    return res.status(400).send({
      phone: {
        code: "phone invalid",
        message: "Phone number is already used",
      },
    })
  }

  if (!employee.permissions) {
    employee.permissions = Object.keys(locations).reduce(
      (acc, location) => ({
        ...acc,
        [location]: apiEndpoints.reduce(
          (acc, api) => ({
            ...acc,
            [api]: [],
          }),
          {}
        ),
      }),
      {}
    )
  }

  next()
}

function read({ body: employee = {} }, res, next) {
  next()
}

function update(
  { body: employee = {}, headers: { authorization = "" } },
  res,
  next
) {
  const errors = validateRequiredFields(employee, employeeRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const token = authorization.split(" ")[1]
  const { data: userEmail } = jwt.decode(token)

  const dbUser = jsonServerDB
    .getState()
    .employees.find(
      ({ email: employeeEmail } = {}) => employeeEmail === userEmail
    )

  const dbEmployee = jsonServerDB
    .getState()
    .employees.find(({ id } = {}) => id === employee.id)

  employee.permissions = Object.keys(locations).reduce(
    (acc, location) => ({
      ...acc,
      [location]: apiEndpoints.reduce(
        (acc, api) => ({
          ...acc,
          [api]: apiActions.reduce((acc, action) => {
            if (dbUser.permissions[location]?.[api]?.includes(action)) {
              if (!employee.permissions[location]?.[api]?.includes(action)) {
                return acc.filter((item) => item !== action)
              }

              if (!acc.includes(action)) {
                return [...acc, action]
              }
            }

            return acc
          }, dbEmployee.permissions[location]?.[api] || []),
        }),
        {}
      ),
    }),
    {}
  )

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
