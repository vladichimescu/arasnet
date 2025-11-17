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
    canCreatePrep,
    canCreateTesting,
    canCreatePartner,
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
                  : canCreatePrep || canCreateTesting || canCreatePartner
                    ? "public-form"
                    : "logout"
          : "login"
      }
    />
  )
  // return <Navigate replace to={isLogged ? "dashboard" : "landing"} />
}

export default Home
