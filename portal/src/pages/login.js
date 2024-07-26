import React from "react"
import { Navigate } from "react-router-dom"

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
          label: "Email",
          name: "email",
          required: true,
        },
        {
          type: "password",
          label: "Password",
          name: "password",
          required: true,
        },
      ]}
    />
  )
}

export default Login
