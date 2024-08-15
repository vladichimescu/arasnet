import React, { useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import AuthApi from "../apis/auth-api"
import { useAuth } from "../components/auth-provider"
import Loading from "../components/loading"

function Restart() {
  const navigate = useNavigate()

  const { isLogged } = useAuth()

  useEffect(
    () => () => {
      toast.dismiss()
    },
    []
  )

  useEffect(() => {
    if (isLogged) {
      async function restart() {
        try {
          await AuthApi.restart()
        } catch {
        } finally {
          setTimeout(() => {
            navigate("/")
          }, 3000)
        }
      }

      restart()
    }
  }, [isLogged, navigate])

  if (isLogged) {
    return <Loading />
  }

  return <Navigate replace to="/" />
}

export default Restart
