import React, { Fragment, useEffect, useState } from "react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

import ConsultationsApi from "../apis/consultations-api"

import { useActions } from "./actions-provider"
import Modal from "./modal"

const supportedLocations = process.env.REACT_APP_SUPPORTED_LOCATIONS.split(",")

function CreateConsultation({ onSuccess = () => {} }) {
  const { addAction, removeAction } = useActions()

  const [errors, setErrors] = useState()
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const createConsultation = () => {
      setErrors(null)
      setIsOpened(true)
    }

    const actionId = addAction({
      label: "Create consultation",
      handler: createConsultation,
      type: "data-grid",
    })

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
          await ConsultationsApi.create(data)

          onSuccess()

          setIsOpened(false)
        } catch (err) {
          setErrors(err)
        }
      }}
      formContent={
        <Fragment>
          <label>
            Phone
            <PhoneInput
              inputProps={{
                name: "phone",
                required: true,
              }}
              enableSearch
              country="ro"
            />
            {errors?.phone && <span>{errors.phone.message}</span>}
          </label>
          <label>
            Date
            <input
              type="datetime-local"
              min={`${new Date().toISOString().slice(0, -8)}`}
              name="date"
              required
            />
            {errors?.date && <span>{errors.date.message}</span>}
          </label>
          <label>
            Location
            <select name="location" required>
              {supportedLocations.map((location) => (
                // TODO: value should the the location but add i18n for display name
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>
        </Fragment>
      }
    />
  )
}

export default CreateConsultation
