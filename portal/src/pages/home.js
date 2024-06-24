import React from "react"
import { Navigate } from "react-router-dom"

import { useAuth } from "../components/auth-provider"

function Home() {
  const { isLogged } = useAuth()

  return <Navigate replace to={isLogged ? "consultations" : "login"} />
  // return <Navigate replace to={isLogged ? "dashboard" : "landing"} />
}

export default Home
