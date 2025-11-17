import React, { useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"

import TestingApi from "../apis/testing-api"
import ActionService from "../services/action-service"

import Modal from "./modal"
import TestingForm from "./testing-form"

const isMobile = navigator.maxTouchPoints > 0

function CreateTesting() {
  const [isOpened, setIsOpened] = useState(false)

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
      <TestingForm
        onSubmit={async (data) => {
          await TestingApi.create(data)

          TestingApi.gridApi.purgeInfiniteCache()

          setIsOpened(false)
        }}
        onCancel={() => {
          setIsOpened(false)
        }}
      />
    </Modal>
  )
}

export default CreateTesting
