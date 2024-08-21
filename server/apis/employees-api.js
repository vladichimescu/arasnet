import jwt from "jsonwebtoken"

import { encrypt, validateRequiredFields } from "@arasnet/functions"
import {
  apiConsultationsEndpoint,
  apiEmployeesEndpoint,
  employeeRequiredFields,
} from "@arasnet/types"

import jsonServerDB from "../index.js"

const apiEndpoints = [apiConsultationsEndpoint, apiEmployeesEndpoint]

async function create({ body: employee = {} }, res, next) {
  const errors = validateRequiredFields(employee, employeeRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const dbEmployeeByEmail = jsonServerDB.employees.find(
    ({ email: employeeEmail } = {}) => employeeEmail === employee.email
  )

  if (dbEmployeeByEmail) {
    return res.status(400).send({
      email: "email_used",
    })
  }

  const dbEmployeeByPhone = jsonServerDB.employees.find(
    ({ phone } = {}) => phone === employee.phone
  )

  if (dbEmployeeByPhone) {
    return res.status(400).send({
      phone: "phone_used",
    })
  }

  if (!employee.permissions) {
    employee.permissions = apiEndpoints.reduce(
      (acc, api) => ({
        ...acc,
        [api]: [],
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

  const { createdBy, permissions: employeePermissions } =
    jsonServerDB.employees.find(({ id } = {}) => id === employee.id)

  if (createdBy === "SYSTEM") {
    return res.status(403).send("authorization_failed")
  }

  const { permissions: userPermissions } = jsonServerDB.employees.find(
    ({ email: employeeEmail } = {}) => employeeEmail === userEmail
  )

  const { permissions } = employee

  const readonlyPermissions = Object.entries(employeePermissions).reduce(
    (acc, [api, actions]) => {
      if (!userPermissions[api]) {
        return {
          ...acc,
          [api]: employeePermissions[api],
        }
      }

      return {
        ...acc,
        [api]: actions.reduce((accActions, actionPermissions) => {
          const [action, ...filters] = actionPermissions

          const userActionPermissions = userPermissions[api].find(
            ([permittedAction]) => permittedAction === action
          )

          if (!userActionPermissions) {
            return [...accActions, actionPermissions]
          }

          const [_userAction, ...userFilters] = userActionPermissions

          if (userFilters.length === 0) {
            return accActions
          }

          if (filters.length === 0) {
            return accActions
          }

          const actionFilters = filters.reduce(
            (accFilters, [filterType, filterValues]) => {
              const userFilter = userFilters.find(
                ([userFilterType]) => userFilterType === filterType
              )

              if (!userFilter) {
                return [...accFilters, filterType, filterValues]
              }

              const [_userFilterType, userFilterValues] = userFilter

              return [
                ...accFilters,
                filterType,
                filterValues.filter(
                  (filterValue) => !userFilterValues.includes(filterValue)
                ),
              ]
            },
            []
          )

          if (actionFilters.length === 0 || actionFilters[1].length === 0) {
            return accActions
          }

          return [...accActions, [action, actionFilters]]
        }, []),
      }
    },
    {}
  )

  const editedPermissions = Object.entries(permissions).reduce(
    (acc, [api, actions]) => {
      if (!userPermissions[api]) {
        return acc
      }

      return {
        ...acc,
        [api]: actions.reduce((accActions, actionPermissions) => {
          const [action, ...filters] = actionPermissions

          const userActionPermissions = userPermissions[api].find(
            ([permittedAction]) => permittedAction === action
          )

          if (!userActionPermissions) {
            return accActions
          }

          const [_userAction, ...userFilters] = userActionPermissions

          if (userFilters.length === 0) {
            return [...accActions, actionPermissions]
          }

          if (filters.length === 0) {
            return [...accActions, userActionPermissions]
          }

          const actionFilters = filters.reduce(
            (accFilters, [filterType, filterValues]) => {
              const userFilter = userFilters.find(
                ([userFilterType]) => userFilterType === filterType
              )

              if (!userFilter) {
                return accFilters
              }

              const [_userFilterType, userFilterValues] = userFilter

              return [
                ...accFilters,
                filterType,
                filterValues.filter((filterValue) =>
                  userFilterValues.includes(filterValue)
                ),
              ]
            },
            []
          )

          if (actionFilters.length === 0 || actionFilters[1].length === 0) {
            return accActions
          }

          return [...accActions, [action, actionFilters]]
        }, []),
      }
    },
    {}
  )

  const updatedPermissions = [
    ...Object.keys(readonlyPermissions),
    ...Object.keys(editedPermissions),
  ]
    .filter((item, index, list) => list.indexOf(item) === index)
    .reduce(
      (apis, api) => ({
        ...apis,
        [api]: [
          ...(readonlyPermissions[api] || []),
          ...(editedPermissions[api] || []),
        ].reduce((actions, actionPermissions) => {
          const [action, ...filters] = actionPermissions

          const actionIndex = actions.findIndex(
            ([addedAction]) => addedAction === action
          )

          if (actionIndex === -1) {
            return [...actions, actionPermissions]
          }

          const [_action, ...addedFilters] = actions[actionIndex]

          const editedFilters = [...addedFilters, ...filters].reduce(
            (accFilters, [filterType, filterValues]) => {
              const filterIndex = accFilters.findIndex(
                ([addedFilterType]) => addedFilterType === filterType
              )

              if (filterIndex === -1) {
                return [...accFilters, [filterType, filterValues]]
              }

              const [_filterType, addedFilterValues] = accFilters[filterIndex]

              accFilters[filterIndex] = [
                filterType,
                [...addedFilterValues, ...filterValues].filter(
                  (item, index, list) => list.indexOf(item) === index
                ),
              ]

              return accFilters
            },
            []
          )

          actions[actionIndex] = [action, ...editedFilters]

          return actions
        }, []),
      }),
      {}
    )

  employee.permissions = updatedPermissions

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
