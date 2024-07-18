import React, { useEffect, useState } from "react"

import EmployeesApi from "../apis/employees-api"

import { useActions } from "./actions-provider"
import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreateEmployee() {
  const { addAction, removeAction } = useActions()

  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const actionId = addAction({
      label: "Add employee",
      handler: () => {
        setIsOpened(true)
      },
      type: isMobile ? "data-grid" : "top-bar",
    })

    return () => {
      removeAction(actionId)
    }
  }, [addAction, removeAction])

  return (
    <Modal
      open={isOpened}
      onClose={() => {
        setIsOpened(false)
      }}
    >
      <Form
        onSubmit={async (data) => {
          await EmployeesApi.create(data)

          EmployeesApi.gridApi.purgeInfiniteCache()

          setIsOpened(false)
        }}
        onCancel={() => {
          setIsOpened(false)
        }}
        inputs={[
          {
            type: "text",
            label: "First name",
            name: "first",
            required: true,
          },
          {
            type: "text",
            label: "Last name",
            name: "last",
            required: true,
          },
          {
            type: "phone-input",
            label: "Phone",
            name: "phone",
            required: true,
            enableSearch: true,
            country: "ro",
            autoFormat: false,
          },
          {
            type: "email",
            label: "Email",
            name: "email",
            required: true,
          },
          {
            type: "text",
            label: "Temp password",
            name: "password",
            required: true,
          },
        ]}
      />
    </Modal>
  )
}

export default CreateEmployee
