import React from "react"

function ErrorFallback({ error }) {
  return (
    <div
      style={{
        flex: 1,
        maxWidth: "90%",
        alignContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <h1>Oops, something went wrong!</h1>
      <small>{`${error?.message || error}`}</small>
    </div>
  )
}

export default ErrorFallback
