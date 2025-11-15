import React from "react"

import { i18n } from "@arasnet/i18n"
import { services } from "@arasnet/types"

import Form from "../components/form/form"

const containerStyle = {
  maxWidth: "500px",
  marginLeft: "auto",
  marginRight: "auto",
}

function PublicForm() {
  const [hasAgreed, setHasAgreed] = React.useState()
  const [formType, setFormType] = React.useState()

  if (formType) {
    switch (formType) {
      case services.TESTING:
        return <FormTesting />
      case services.PREP:
        return <FormPrep />
      case services.PARTNER:
        return <FormPartner />
      default:
        throw i18n.t("generic.error.service_invalid.message")
    }
  }

  if (hasAgreed === undefined) {
    return <AvailabilityForm onSubmit={(data) => setHasAgreed(data)} />
  }

  if (hasAgreed === false) {
    return <FormDenied />
  }

  return <FormTypes onSubmit={(data) => setFormType(data)} />
}

function AvailabilityForm({ onSubmit }) {
  return (
    <Form
      style={containerStyle}
      onSubmit={async () => {
        onSubmit(true)
      }}
      submitLabel={i18n.t("generic.boolean.yes")}
      onCancel={() => {
        onSubmit(false)
      }}
      cancelLabel={i18n.t("generic.boolean.no")}
      heading={<h4>{i18n.t("page.publicForm.AvailabilityForm.heading")}</h4>}
      content={
        <label>{i18n.t("page.publicForm.AvailabilityForm.content")}</label>
      }
    />
  )
}

function FormDenied() {
  return (
    <div
      style={{
        ...containerStyle,
        whiteSpace: "pre-line",
      }}
    >
      {i18n.t("page.publicForm.FormDenied.content")}
    </div>
  )
}

function FormTypes({ onSubmit }) {
  const serviceList = Object.values(services).map((service) => [
    service,
    {
      label: i18n.t(`entity.${service}.denomination`),
      value: service,
    },
  ])

  return (
    <Form
      style={containerStyle}
      onSubmit={async (data) => {
        onSubmit(data.formType)
      }}
      submitLabel={i18n.t("generic.action.continue")}
      inputs={[
        {
          type: "select",
          label: "Pentru ce vrei sa faci programarea?",
          name: "formType",
          required: true,
          list: serviceList,
          defaultValue: services.TESTING,
        },
      ]}
    />
  )
}

function FormTesting() {
  return <div>Testing Form</div>
}

function FormPrep() {
  return <div>Prep Form</div>
}

function FormPartner() {
  return <div>Partner Form</div>
}

export default PublicForm
