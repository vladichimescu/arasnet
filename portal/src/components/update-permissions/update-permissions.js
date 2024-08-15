import React, { Fragment } from "react"

import { apiActions, apiEmployeesEndpoint, locations } from "@arasnet/types"

import EmployeesApi from "../../apis/employees-api"
import { useAuth } from "../auth-provider"
import Form from "../form/form"
import Modal from "../modal"

import styles from "./update-permissions.module.scss"

function UpdatePermissions({ open, onClose, employee }) {
  const { canUpdateEmployees, permissions } = useAuth()

  return (
    <Modal open={open} onClose={onClose}>
      <Form
        className={styles.permissions}
        onSubmit={
          !canUpdateEmployees
            ? null
            : async (data) => {
                const updatedEmployee = {
                  ...employee,
                  permissions: Object.keys(data).reduce((acc, key) => {
                    const [api, action, filterType, filterValue] =
                      key.split("_")

                    const permission =
                      filterType && filterValue
                        ? [action, [filterType, [filterValue]]]
                        : [action]

                    if (!acc[api]) {
                      acc[api] = []
                    }

                    const actionIndex = acc[api].findIndex(
                      ([curAction]) => curAction === action
                    )

                    if (actionIndex === -1) {
                      acc[api].push(permission)
                    } else {
                      const filterIndex = acc[api][actionIndex].findIndex(
                        ([curFilter]) => curFilter === filterType
                      )

                      if (filterIndex === -1) {
                        acc[api][actionIndex] = [
                          ...acc[api][actionIndex],
                          [filterType, [filterValue]],
                        ]
                      } else {
                        acc[api][actionIndex][filterIndex][1].push(filterValue)
                      }
                    }

                    return acc
                  }, {}),
                }

                console.log(updatedEmployee.permissions)

                await EmployeesApi.update(updatedEmployee)

                EmployeesApi.gridApi
                  .getRowNode(`${employee.id}`)
                  .updateData(updatedEmployee)

                onClose()
              }
        }
        onCancel={onClose}
        heading={
          <Fragment>
            <h4>
              {employee.first} {employee.last}
            </h4>
            <small>{employee.email}</small>
          </Fragment>
        }
        content={
          <section>
            {apiActions.map((action) => (
              <label key={action}>{action}</label>
            ))}

            <label>{apiEmployeesEndpoint}</label>

            {apiActions.map((action) => (
              <Fragment key={`${apiEmployeesEndpoint}_${action}`}>
                <input
                  type="checkbox"
                  name={`${apiEmployeesEndpoint}_${action}`}
                  defaultChecked={employee.permissions[
                    apiEmployeesEndpoint
                  ]?.find(([permittedAction]) => permittedAction === action)}
                  disabled={
                    !canUpdateEmployees ||
                    !permissions[apiEmployeesEndpoint]?.find(
                      ([permittedAction]) => permittedAction === action
                    )
                  }
                />
              </Fragment>
            ))}

            {Object.entries(locations).map(
              ([locationId, { label: locationLabel, services }]) => (
                <Fragment key={locationId}>
                  <h5>{locationLabel}</h5>

                  {services.map((api) => (
                    <Fragment key={`${api}_${locationId}`}>
                      <label>{api}</label>

                      {apiActions.map((action) => (
                        <Fragment key={`${api}_${action}_${locationId}`}>
                          <input
                            type="checkbox"
                            name={`${api}_${action}_location_${locationId}`}
                            defaultChecked={employee.permissions[api]?.find(
                              ([permittedAction, ...filters]) =>
                                permittedAction === action &&
                                (filters.length === 0
                                  ? true
                                  : filters.find(
                                      ([filter, values]) =>
                                        filter === "location" &&
                                        values.includes(locationId)
                                    ))
                            )}
                            disabled={
                              !canUpdateEmployees ||
                              !permissions[api]?.find(
                                ([permittedAction, ...filters]) =>
                                  permittedAction === action &&
                                  (filters.length === 0
                                    ? true
                                    : filters.find(
                                        ([filter, values]) =>
                                          filter === "location" &&
                                          values.includes(locationId)
                                      ))
                              )
                            }
                          />
                        </Fragment>
                      ))}
                    </Fragment>
                  ))}
                </Fragment>
              )
            )}
          </section>
        }
      />
    </Modal>
  )
}

export default UpdatePermissions
