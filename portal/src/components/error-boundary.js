import React, { Component } from "react"

import ErrorFallback from "./error-fallback"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // TODO: log error system
  }

  render() {
    const {
      state: { error },
      props: { children },
    } = this

    if (error) {
      return <ErrorFallback error={error} />
    }

    return children
  }
}

export default ErrorBoundary
