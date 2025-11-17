import React, { useEffect, useMemo, useState } from "react"

import { i18n } from "@arasnet/i18n"
import { testingLocations } from "@arasnet/types"

import TestingApi from "../apis/testing-api"

import { useAuth } from "./auth-provider"
import Form from "./form/form"

function TestingForm({ isPublic, ...props }) {
  const { permissions } = useAuth()

  const locations = useMemo(
    () =>
      isPublic
        ? Object.entries(testingLocations)
        : Object.entries(testingLocations).filter(([locationId]) =>
            permissions.testing.find(
              ([permittedAction, ...filters]) =>
                permittedAction === "create" &&
                (filters.length === 0
                  ? true
                  : filters.find(([filter, values]) =>
                      filter === "location" ? values.includes(locationId) : true
                    ))
            )
          ),
    [isPublic, permissions]
  )

  const [availableDates, setAvailableDates] = useState()

  const [unavailableDates, setUnavailableDates] = useState()

  async function setDates(locationId) {
    const businessDates = testingLocations[locationId].businessHours
    const testingDates = await getUnavailableDates(locationId, isPublic)

    setAvailableDates(businessDates)
    setUnavailableDates(testingDates)
  }

  useEffect(() => {
    setDates(locations[0][0])
  }, [locations])

  return (
    <Form
      {...props}
      inputs={[
        {
          type: "select",
          label: i18n.t("entity.field.location"),
          name: "location",
          required: true,
          list: locations,
          onChange: async (e) => {
            setDates(e.target.value)
          },
        },
        {
          type: "datetime-input",
          label: i18n.t("entity.field.date"),
          name: "date",
          required: true,
          availableDates,
          unavailableDates,
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
          type: "bool",
          label: i18n.t("entity.field.firstTime"),
          name: "firstTime",
          required: true,
        },
      ]}
    />
  )
}

export default TestingForm

//#region
async function getUnavailableDates(location, isPublic) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  return (
    await TestingApi.read({
      date_gte: date.toISOString(),
      location,
      isPublic,
    })
  ).map(({ date }) => date)
}
//#endregion
