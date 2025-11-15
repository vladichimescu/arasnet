import React from "react"
import { useRouteError } from "react-router-dom"

import ErrorFallback from "./error-fallback"

function ErrorRouteElement() {
  const error = useRouteError()

  return <ErrorFallback error={error} />
}

export default ErrorRouteElement
