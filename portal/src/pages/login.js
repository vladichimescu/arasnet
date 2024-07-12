import React, { useState } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../components/auth-provider"

function Login() {
  const { isLogged, login } = useAuth()
  const [errors, setErrors] = useState()

  function onSubmit(ev) {
    ev.preventDefault()

    const form = ev.currentTarget
    const email = form.email.value
    const password = form.password.value

    login({ email, password }).catch(setErrors)
  }

  if (isLogged) {
    return <Navigate to="/" />
  }

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        marginLeft: "auto",
        marginRight: "auto",
        gap: "16px",
        width: "min(80vw, 400px)",
      }}
      onSubmit={onSubmit}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        email
        <input
          style={{
            padding: "8px",
          }}
          name="email"
          type="email"
          required
        />
        {errors?.email && <span>{errors.email.message}</span>}
      </label>

      <label
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: "14px",
        }}
      >
        password
        <input
          style={{
            padding: "8px",
          }}
          name="password"
          type="password"
          required
        />
        {errors?.password && <span>{errors.password.message}</span>}
      </label>

      <button
        style={{
          padding: "8px",
        }}
        type="submit"
      >
        login
      </button>
      {errors && !errors.email && !errors.password ? errors.message : null}
    </form>
  )
}

export default Login
