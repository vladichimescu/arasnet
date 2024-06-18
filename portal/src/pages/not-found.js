import React, { Fragment, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

function NotFound({ delay = 2500, path = "/" }) {
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const navTimeout = setTimeout(() => setRedirect(true), delay)

    return () => clearTimeout(navTimeout)
  }, [delay, path])

  return redirect ? (
    <Navigate replace to={path} />
  ) : (
    <Fragment>
      <h2>Oops, not found!</h2>
      <p>redirecting in {delay / 1000} seconds...</p>
    </Fragment>
  )
}

export default NotFound
