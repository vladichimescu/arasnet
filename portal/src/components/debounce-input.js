import React, { useEffect, useRef } from "react"

function DebounceInput({
  debounce = 700,
  type = "text",
  onChange: change,
  ...props
}) {
  const timer = useRef(0)

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <input
      type={type}
      onChange={(...args) => {
        clearTimeout(timer.current)

        timer.current = setTimeout(() => change?.apply(null, args), debounce)
      }}
      {...props}
    />
  )
}

export default DebounceInput
