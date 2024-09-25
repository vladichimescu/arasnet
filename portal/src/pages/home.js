import React from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../components/auth-provider"

function Home() {
  const {
    isLogged,
    canReadTesting,
    canReadPrep,
    canReadPartner,
    canReadEmployees,
  } = useAuth()

  return (
    <Navigate
      replace
      to={
        isLogged
          ? canReadTesting
            ? "testing"
            : canReadPartner
              ? "partner"
              : canReadPrep
                ? "prep"
                : canReadEmployees
                  ? "employee"
                  : "logout"
          : "login"
      }
    />
  )
  // return <Navigate replace to={isLogged ? "dashboard" : "landing"} />
}

export default Home
