import React, { useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"
import { partnerAccounts, partnerTests, testingLocations } from "@arasnet/types"

import PartnerApi from "../apis/partner-api"
import ActionService from "../services/action-service"

import Form from "./form/form"
import Modal from "./modal"

const isMobile = navigator.maxTouchPoints > 0

function CreatePartner() {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const actionId = ActionService.create(
      isMobile ? "data-grid" : "nav-bar",
      () => {
        setIsOpened(true)
      },
      i18n.t("page.partner.action.addPartner")
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
          await PartnerApi.create(data)

          PartnerApi.gridApi.purgeInfiniteCache()

          setIsOpened(false)
        }}
        onCancel={() => {
          setIsOpened(false)
        }}
        inputs={[
          {
            type: "select",
            label: i18n.t("entity.field.test"),
            name: "test",
            required: true,
            list: Object.entries(partnerTests),
          },
          {
            type: "select",
            label: i18n.t("entity.field.location"),
            name: "location",
            required: true,
            list: Object.entries(testingLocations),
          },
          {
            type: "bool",
            label: i18n.t("entity.field.confirmation"),
            name: "confirmation",
            required: true,
          },
          {
            type: "multi-select-input",
            label: i18n.t("entity.field.contacts"),
            name: "contacts",
            required: true,
            list: Object.entries(partnerAccounts),
          },
        ]}
      />
    </Modal>
  )
}

export default CreatePartner
