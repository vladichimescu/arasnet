import React, { useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"

import EmployeesApi from "../apis/employees-api"
import ActionService from "../services/action-service"

import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreateEmployee() {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const actionId = ActionService.create(
      isMobile ? "data-grid" : "nav-bar",
      () => {
        setIsOpened(true)
      },
      i18n.t("page.employees.action.addEmployee")
    )

    return () => {
      ActionService.remove(actionId)
    }
  }, [])

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
            label: i18n.t("entity.field.firstName"),
            name: "firstName",
            required: true,
          },
          {
            type: "text",
            label: i18n.t("entity.field.lastName"),
            name: "lastName",
            required: true,
          },
          {
            type: "phone-input",
            label: i18n.t("entity.field.phone"),
            name: "phone",
            required: true,
          },
          {
            type: "email",
            label: i18n.t("entity.field.email"),
            name: "email",
            required: true,
          },
        ]}
      />
    </Modal>
  )
}

export default CreateEmployee
