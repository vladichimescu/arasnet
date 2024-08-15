import React, { useEffect, useState } from "react"

import { consultationLocations } from "@arasnet/types"

import ConsultationsApi from "../apis/consultations-api"
import ActionService from "../services/action-service"

import { useAuth } from "./auth-provider"
import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreateConsultation() {
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
      "Create consultation"
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
          await ConsultationsApi.create(data)

          ConsultationsApi.gridApi.purgeInfiniteCache()

          setIsOpened(false)
        }}
        onCancel={() => {
          setIsOpened(false)
        }}
        inputs={[
          {
            type: "phone-input",
            label: "Phone",
            name: "phone",
            required: true,
          },
          {
            type: "datetime-local",
            label: "Date",
            name: "date",
            required: true,
            min: `${minDatetimeLocal.toISOString().slice(0, -8)}`,
          },
          {
            type: "select",
            label: "Location",
            name: "location",
            required: true,
            list: Object.entries(consultationLocations).filter(([locationId]) =>
              permissions.consultations.find(
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
        ]}
      />
    </Modal>
  )
}

export default CreateConsultation
