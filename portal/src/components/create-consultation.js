import React, { Fragment, useEffect, useState } from "react"

import ConsultationsApi from "../apis/consultations-api"

import { useActions } from "./actions-provider"
import Modal from "./modal"

const supportedLocations = process.env.REACT_APP_SUPPORTED_LOCATIONS.split(",")

function CreateConsultation() {
  const { addAction, removeAction } = useActions()

  const [errors, setErrors] = useState()
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const createConsultation = () => {
      setErrors(null)
      setIsOpened(true)
    }

    const actionId = addAction(createConsultation, "Create consultation")

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

          setIsOpened(false)
        } catch (err) {
          setErrors(err)
        }
      }}
      formContent={
        <Fragment>
          <label>
            Phone
            <input type="number" name="phone" required />
            {errors?.phone && <span>{errors.phone.message}</span>}
          </label>
          <label>
            Date
            <input type="text" name="date" required />
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
