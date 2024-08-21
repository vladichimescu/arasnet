import React from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../components/auth-provider"

function Home() {
  const { isLogged, canReadConsultations, canReadEmployees } = useAuth()

  return (
    <Navigate
      replace
      to={
        isLogged
          ? canReadConsultations
            ? "consultations"
            : canReadEmployees
              ? "employees"
              : "logout"
          : "login"
      }
    />
  )
  // return <Navigate replace to={isLogged ? "dashboard" : "landing"} />
}

export default Home
