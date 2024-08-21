import React from "react"
import { Navigate } from "react-router-dom"

import { i18n } from "@arasnet/i18n"

import { useAuth } from "../components/auth-provider"
import Form from "../components/form/form"

function Login() {
  const { isLogged, login } = useAuth()

  if (isLogged) {
    return <Navigate to="/" />
  }

  return (
    <Form
      style={{
        alignSelf: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width: "min(90vw, 400px)",
      }}
      onSubmit={login}
      submitLabel={i18n.t("generic.action.login")}
      heading={
        <h1>
          ARAS<small>NET</small>
          <small
            style={{
              marginLeft: "auto",
            }}
          >
            ADMIN
          </small>
        </h1>
      }
      inputs={[
        {
          type: "email",
          label: i18n.t("entity.field.email"),
          name: "email",
          required: true,
        },
        {
          type: "password",
          label: i18n.t("entity.field.password"),
          name: "password",
          required: true,
        },
      ]}
    />
  )
}

export default Login
