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
      <h1>Oops, not ok!</h1>
      <small>{`${error}`}</small>
    </div>
  )
}

export default ErrorFallback
