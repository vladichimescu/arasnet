import React, { useEffect, useState } from "react"

import { consultationLocations } from "@arasnet/types"

import ConsultationsApi from "../apis/consultations-api"

import { useActions } from "./actions-provider"
import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreateConsultation() {
  const { addAction, removeAction } = useActions()

  const [isOpened, setIsOpened] = useState(false)

  const minDatetimeLocal = new Date()
  minDatetimeLocal.setMinutes(
    minDatetimeLocal.getMinutes() - minDatetimeLocal.getTimezoneOffset()
  )

  useEffect(() => {
    const createConsultation = () => {
      setIsOpened(true)
    }

    const actionId = addAction({
      label: "Create consultation",
      handler: createConsultation,
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
            enableSearch: true,
            country: "ro",
            autoFormat: false,
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
            list: Object.entries(consultationLocations),
          },
        ]}
      />
    </Modal>
  )
}

export default CreateConsultation
