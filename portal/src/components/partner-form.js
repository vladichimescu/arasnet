import React from "react"

import { i18n } from "@arasnet/i18n"
import { partnerAccounts, partnerTests, testingLocations } from "@arasnet/types"

import Form from "./form/form"

function PartnerForm(props) {
  return (
    <Form
      {...props}
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
  )
}

export default PartnerForm
