import React, { useEffect, useMemo, useState } from "react"

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

  const locations = useMemo(
    () =>
      Object.entries(testingLocations).filter(([locationId]) =>
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
    [permissions]
  )

  const [availableDates, setAvailableDates] = useState()

  const [unavailableDates, setUnavailableDates] = useState()

  async function setDates(locationId) {
    const businessDates = testingLocations[locationId].businessHours
    const testingDates = await getUnavailableDates(locationId)

    setAvailableDates(businessDates)
    setUnavailableDates(testingDates)
  }

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

  useEffect(() => {
    if (!isOpened) {
      return
    }

    setDates(locations[0][0])
  }, [isOpened, locations])

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

          setDates(data.location)
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
    </Modal>
  )
}

export default CreateTesting

//#region
async function getUnavailableDates(location) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  return (
    await TestingApi.read({
      date_gte: date.toISOString(),
      location,
    })
  ).map(({ date }) => date)
}
//#endregion
