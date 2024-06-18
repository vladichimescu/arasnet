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

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

export default ErrorBoundary
