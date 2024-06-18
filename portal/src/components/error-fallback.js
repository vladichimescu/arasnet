import React, { useEffect } from "react"
import { toast } from "react-toastify"

const ErrorFallback = ({ error }) => {
  useEffect(() => {
    toast("Try again, refresh the page")
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
      }}
    >
      <h1>Ooops, something went wrong</h1>
      <small>{`${error}`}</small>
    </div>
  )
}

export default ErrorFallback
