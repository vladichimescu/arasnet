import React, { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

function NotFound({ delay = 2500, path = "/" }) {
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const navTimeout = setTimeout(() => {
      setRedirect(true)
    }, delay)

    return () => {
      clearTimeout(navTimeout)
    }
  }, [delay, path])

  return redirect ? (
    <Navigate replace to={path} />
  ) : (
    <div
      style={{
        maxWidth: "90%",
        alignSelf: "center",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <h1>Oops, not found!</h1>
      <small>redirecting in {delay / 1000} seconds...</small>
    </div>
  )
}

export default NotFound
