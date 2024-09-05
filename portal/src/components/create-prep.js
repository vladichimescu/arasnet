import React, { useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"
import { prepCategories, prepLocations } from "@arasnet/types"

import PrepApi from "../apis/prep-api"
import ActionService from "../services/action-service"

import { useAuth } from "./auth-provider"
import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreatePrep() {
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
      i18n.t("page.prep.action.addPrep")
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
          await PrepApi.create(data)

          PrepApi.gridApi.purgeInfiniteCache()

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
            list: Object.entries(prepLocations).filter(([locationId]) =>
              permissions.prep.find(
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
          {
            type: "select",
            label: i18n.t("entity.field.category"),
            name: "category",
            required: true,
            list: Object.entries(prepCategories),
          },
        ]}
      />
    </Modal>
  )
}

export default CreatePrep
