import React, { Fragment, useEffect } from "react"

import { Trans, i18n } from "@arasnet/i18n"
import { services } from "@arasnet/types"

import PartnerApi from "../apis/partner-api"
import TestingApi from "../apis/testing-api"
import { useAuth } from "../components/auth-provider"
import Form from "../components/form/form"
import PartnerForm from "../components/partner-form"
import TestingForm from "../components/testing-form"

const containerStyle = {
  alignSelf: "center",
  marginLeft: "auto",
  marginRight: "auto",
  width: "min(90vw, 400px)",
}

function PublicForm() {
  const { login, logout } = useAuth()

  const [hasAgreed, setHasAgreed] = React.useState(null)
  const [formType, setFormType] = React.useState(null)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  useEffect(() => {
    login({
      email: process.env.REACT_APP_PUBLIC_FORM_EMAIL,
      password: process.env.REACT_APP_PUBLIC_FORM_PASSWORD,
    })

    return () => {
      logout()
    }
  }, [login, logout])

  if (isSubmitted) {
    return <FormSuccess />
  }

  if (formType) {
    switch (formType) {
      case services.TESTING:
        return (
          <FormTesting
            onSubmit={() => setIsSubmitted(true)}
            onCancel={() => setFormType(null)}
          />
        )
      case services.PREP:
        return <FormPrep />
      case services.PARTNER:
        return (
          <FormPartner
            onSubmit={() => setIsSubmitted(true)}
            onCancel={() => setFormType(null)}
          />
        )
      default:
        throw i18n.t("generic.error.service_invalid.message")
    }
  }

  if (hasAgreed === null) {
    return <AvailabilityForm onSubmit={(data) => setHasAgreed(data)} />
  }

  if (hasAgreed === false) {
    return <FormDenied />
  }

  return (
    <FormTypes
      onSubmit={(data) => setFormType(data)}
      onCancel={() => setHasAgreed(null)}
    />
  )
}

function AvailabilityForm({ onSubmit: handleSubmit }) {
  return (
    <Form
      style={containerStyle}
      onSubmit={async () => {
        handleSubmit(true)
      }}
      submitLabel={i18n.t("generic.boolean.yes")}
      onCancel={() => {
        handleSubmit(false)
      }}
      cancelLabel={i18n.t("generic.boolean.no")}
      heading={<h4>{i18n.t("page.publicForm.AvailabilityForm.heading")}</h4>}
      content={
        <label>{i18n.t("page.publicForm.AvailabilityForm.content")}</label>
      }
    />
  )
}

function FormTypes({ onSubmit: handleSubmit, onCancel: handleCancel }) {
  const serviceList = Object.values(services).map((service) => [
    service,
    {
      label: i18n.t(`entity.${service}.denomination`),
      value: service,
      disabled: service === services.PREP,
    },
  ])

  return (
    <Form
      style={containerStyle}
      onSubmit={async (data) => {
        handleSubmit(data.formType)
      }}
      submitLabel={i18n.t("generic.action.continue")}
      onCancel={handleCancel}
      cancelLabel={i18n.t("generic.action.back")}
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
      content={
        <small>
          <Trans
            i18nKey="page.publicForm.GDPR"
            components={{
              gdprLink: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </small>
      }
    />
  )
}

function FormTesting({ onSubmit: handleSubmit, onCancel: handleCancel }) {
  return (
    <TestingForm
      style={containerStyle}
      onSubmit={async (data) => {
        await TestingApi.create(data)

        handleSubmit()
      }}
      onCancel={handleCancel}
      cancelLabel={i18n.t("generic.action.back")}
    />
  )
}

function FormPrep() {
  return <div>Prep Form</div>
}

function FormPartner({ onSubmit: handleSubmit, onCancel: handleCancel }) {
  return (
    <PartnerForm
      style={containerStyle}
      onSubmit={async (data) => {
        await PartnerApi.create(data)

        handleSubmit()
      }}
      onCancel={handleCancel}
      cancelLabel={i18n.t("generic.action.back")}
    />
  )
}

function FormDenied() {
  const phoneNumber = "+40212100747"
  const mapAddress = "PrEPpoint ARAS Bucuresti, București 030167"

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`

  return (
    <Fragment>
      <div
        style={{
          ...containerStyle,
          whiteSpace: "pre-line",
        }}
      >
        <h1>{i18n.t("page.publicForm.FormDenied.heading")}</h1>

        <Trans
          i18nKey="page.publicForm.FormDenied.content"
          components={{
            phoneLink: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                style={{
                  whiteSpace: "nowrap",
                }}
                href={`tel:${phoneNumber}`}
              />
            ),
            mapsLink: (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" />
            ),
          }}
        />
      </div>
    </Fragment>
  )
}

function FormSuccess() {
  return (
    <div style={containerStyle}>
      <h1>{i18n.t("page.publicForm.FormSuccess.heading")}</h1>

      <p>{i18n.t("page.publicForm.FormSuccess.content")}</p>
    </div>
  )
}

export default PublicForm
