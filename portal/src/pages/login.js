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
    <form onSubmit={onSubmit}>
      <label>
        email
        <input name="email" type="email" required />
        {errors?.email && <span>{errors.email.message}</span>}
      </label>
      <br />

      <label>
        password
        <input name="password" type="password" required />
        {errors?.password && <span>{errors.password.message}</span>}
      </label>
      <br />

      <button type="submit">login</button>
      {errors && !errors.email && !errors.password ? errors.message : null}
    </form>
  )
}

export default Login
