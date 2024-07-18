import React, { Fragment } from "react"

import { locations } from "@arasnet/types"

import EmployeesApi from "../../apis/employees-api"
import { useAuth } from "../auth-provider"
import Form from "../form/form"
import Modal from "../modal"

import styles from "./update-permissions.module.scss"

const apis = [
  process.env.REACT_APP_SERVER_PATH_EMPLOYEES,
  process.env.REACT_APP_SERVER_PATH_CONSULTATIONS,
]
const actions = ["create", "read", "update", "delete"]

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
                    const [location, api, action] = key.split("_")

                    return {
                      ...acc,
                      [location]: {
                        ...acc[location],
                        [api]: (acc[location]?.[api] || []).concat(action),
                      },
                    }
                  }, {}),
                }

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
            {actions.map((action) => (
              <label key={action}>{action}</label>
            ))}

            {Object.entries(locations).map(
              ([locationId, { label: locationLabel }]) => (
                <Fragment key={locationId}>
                  <h4>{locationLabel}</h4>

                  {apis.map((api) => (
                    <Fragment key={`${locationId}_${api}`}>
                      <label>{api}</label>

                      {actions.map((action) => (
                        <Fragment key={`${locationId}_${api}_${action}`}>
                          <input
                            type="checkbox"
                            name={`${locationId}_${api}_${action}`}
                            defaultChecked={employee.permissions[locationId]?.[
                              api
                            ]?.includes(action)}
                            disabled={
                              !canUpdateEmployees ||
                              !permissions[locationId]?.[api]?.includes(action)
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
