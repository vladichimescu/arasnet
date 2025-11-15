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
      <h1>Oops!</h1>
      <small
        style={{
          color: "red",
        }}
      >{`${error?.message || error}`}</small>
    </div>
  )
}

export default ErrorFallback
