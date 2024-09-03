import React, { useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"
import { testingLocations } from "@arasnet/types"

import TestingApi from "../apis/testing-api"
import ActionService from "../services/action-service"

import { useAuth } from "./auth-provider"
import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreateTesting() {
  const { permissions } = useAuth()

  const [isOpened, setIsOpened] = useState(false)

  const minDatetimeLocal = new Date()
  minDatetimeLocal.setMinutes(
    minDatetimeLocal.getMinutes() - minDatetimeLocal.getTimezoneOffset()
  )

  useEffect(() => {
    const actionId = ActionService.create(
      isMobile ? "data-grid" : "nav-bar",
      () => {
        setIsOpened(true)
      },
      i18n.t("page.testing.action.addTesting")
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
          await TestingApi.create(data)

          TestingApi.gridApi.purgeInfiniteCache()

          setIsOpened(false)
        }}
        onCancel={() => {
          setIsOpened(false)
        }}
        inputs={[
          {
            type: "select",
            label: i18n.t("entity.field.location"),
            name: "location",
            required: true,
            list: Object.entries(testingLocations).filter(([locationId]) =>
              permissions.testing.find(
                ([permittedAction, ...filters]) =>
                  permittedAction === "create" &&
                  (filters.length === 0
                    ? true
                    : filters.find(([filter, values]) =>
                        filter === "location"
                          ? values.includes(locationId)
                          : true
                      ))
              )
            ),
          },
          {
            type: "datetime-local",
            label: i18n.t("entity.field.date"),
            name: "date",
            required: true,
            min: `${minDatetimeLocal.toISOString().slice(0, -8)}`,
          },
          {
            type: "phone-input",
            label: i18n.t("entity.field.phone"),
            name: "phone",
            required: true,
          },
          {
            type: "text",
            label: i18n.t("entity.field.name"),
            name: "name",
            required: true,
          },
        ]}
      />
    </Modal>
  )
}

export default CreateTesting
