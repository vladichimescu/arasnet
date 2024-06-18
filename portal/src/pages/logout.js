import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../components/auth-provider"
import Loading from "../components/loading"

function Logout() {
  const { isLogged, logout } = useAuth()

  useEffect(() => {
    if (isLogged) {
      logout()
    }
  }, [isLogged, logout])

  if (isLogged) {
    return <Loading />
  }

  return <Navigate replace to="/" />
}

export default Logout
