import React, { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-input-2"

import styles from "./form.module.scss"

function Form({
  className,
  heading,
  content,
  footer,
  onSubmit,
  onCancel,
  inputs,
}) {
  const focusRef = useRef()

  const [errors, setErrors] = useState()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onSubmit(Object.fromEntries(new FormData(event.target)))
    } catch (err) {
      setErrors(err)
    }
  }

  useEffect(() => {
    focusRef.current?.focus()
  }, [])

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      {heading}

      {inputs?.map(({ type, label, name, list, ...props }) => (
        <fieldset key={name}>
          <label htmlFor={name}>{label}</label>
          {type === "phone-input" ? (
            <PhoneInput
              {...props}
              inputProps={{
                id: name,
                name,
                required: props.required,
              }}
            />
          ) : type === "select" ? (
            <select name={name} {...props}>
              {list.map((item) =>
                typeof item === "string" ? (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ) : (
                  <option key={item[0]} value={item[0]}>
                    {item[1].label}
                  </option>
                )
              )}
            </select>
          ) : (
            <input id={name} name={name} type={type} {...props} />
          )}

          <small>{errors?.[name]?.code}</small>
        </fieldset>
      ))}

      {content}

      <fieldset style={{ marginBottom: 0 }}>
        {onSubmit ? <button type="submit">Submit</button> : null}

        <small>{errors?.code}</small>
      </fieldset>

      {onCancel ? (
        <button
          ref={focusRef}
          type="button"
          className="button-outline"
          value="cancel"
          onClick={() => onCancel()}
        >
          Cancel
        </button>
      ) : null}

      {footer}
    </form>
  )
}

export default Form
