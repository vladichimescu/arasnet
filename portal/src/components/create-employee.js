import React, { Fragment, useEffect, useState } from "react"

import EmployeesApi from "../apis/employees-api"

import { useActions } from "./actions-provider"
import Modal from "./modal"

function CreateEmployee() {
  const { addAction, removeAction } = useActions()

  const [errors, setErrors] = useState()
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const createEmployee = () => {
      setErrors(null)
      setIsOpened(true)
    }

    const actionId = addAction(createEmployee, "Add employee")

    return () => removeAction(actionId)
  }, [addAction, removeAction])

  return (
    <Modal
      open={isOpened}
      onClose={async (data) => {
        if (!data) {
          setIsOpened(false)

          return
        }

        try {
          await EmployeesApi.create(data)

          setIsOpened(false)
        } catch (err) {
          setErrors(err)
        }
      }}
      formContent={
        <Fragment>
          <label>
            First name
            <input type="text" name="first" required />
            {errors?.first && <span>{errors.first.message}</span>}
          </label>
          <label>
            Last name
            <input type="text" name="last" required />
            {errors?.last && <span>{errors.last.message}</span>}
          </label>
          <label>
            Phone
            <input type="number" name="phone" required />
            {errors?.phone && <span>{errors.phone.message}</span>}
          </label>
          <label>
            Email
            <input type="email" name="email" required />
            {errors?.email && <span>{errors.email.message}</span>}
          </label>
          <label>
            Temp password
            <input type="text" name="password" required />
            {errors?.password && <span>{errors.password.message}</span>}
          </label>
        </Fragment>
      }
    />
  )
}

export default CreateEmployee
