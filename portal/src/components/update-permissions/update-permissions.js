import React, { Fragment } from "react"
import { toast } from "react-toastify"

import EmployeesApi from "../../apis/employees-api"
import { useAuth } from "../auth-provider"
import Modal from "../modal"

import classes from "./update-permissions.module.scss"

const locations = process.env.REACT_APP_LOCATIONS.split(",")

const apis = [
  process.env.REACT_APP_SERVER_PATH_EMPLOYEES,
  process.env.REACT_APP_SERVER_PATH_CONSULTATIONS,
]
const actions = ["create", "read", "update", "delete"]

function UpdatePermissions({ isOpened, setIsOpened, employee }) {
  const { canUpdateEmployees, permissions } = useAuth()

  return (
    <Modal
      open={isOpened}
      onClose={async (data) => {
        if (!data) {
          setIsOpened(false)

          return
        }

        const permissions = Object.keys(data).reduce((acc, key) => {
          const [location, api, action] = key.split("-")

          return {
            ...acc,
            [location]: {
              ...acc[location],
              [api]: (acc[location]?.[api] || []).concat(action),
            },
          }
        }, {})

        try {
          await EmployeesApi.update({
            ...employee,
            permissions,
          })

          EmployeesApi.gridApi.getRowNode(`${employee.id}`).updateData({
            ...employee,
            permissions,
          })

          setIsOpened(false)
        } catch (err) {
          toast.error(`Updating error\nreason: ${err.message}`)
        }
      }}
      formContent={
        <div className={classes.updatePermissions}>
          {actions.map((action) => (
            <div className={classes.action} key={action}>
              {action}
            </div>
          ))}

          {locations.map((location) => (
            <Fragment key={location}>
              <div className={classes.location}>{location}</div>

              {apis.map((api) => (
                <Fragment key={`${location}-${api}`}>
                  <div>{api}</div>

                  {actions.map((action) => (
                    <Fragment key={`${location}-${api}-${action}`}>
                      <input
                        type="checkbox"
                        name={`${location}-${api}-${action}`}
                        defaultChecked={employee.permissions[location]?.[
                          api
                        ]?.includes(action)}
                        readOnly={!canUpdateEmployees}
                        disabled={
                          canUpdateEmployees &&
                          !permissions[location]?.[api]?.includes(action)
                        }
                      />
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      }
      disableSubmit={!canUpdateEmployees}
    />
  )
}

export default UpdatePermissions
