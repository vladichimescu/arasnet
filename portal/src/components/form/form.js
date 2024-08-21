import React, { useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-input-2"
import { toast } from "react-toastify"

import { i18n } from "@arasnet/i18n"

import styles from "./form.module.scss"

function Form({
  className,
  style,
  heading,
  content,
  footer,
  onSubmit,
  submitLabel = i18n.t("generic.action.submit"),
  onCancel,
  cancelLabel = i18n.t("generic.action.cancel"),
  inputs,
}) {
  const focusRef = useRef()

  const [errors, setErrors] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    toast.dismiss()
    setErrors(null)
    setIsSubmitting(true)

    try {
      await onSubmit(Object.fromEntries(new FormData(event.target)))
    } catch (err) {
      setErrors(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    focusRef.current?.focus()
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.form} ${className}`}
      style={style}
    >
      {heading}

      {inputs?.map(({ type, label, name, list, ...props }) => (
        <fieldset key={name}>
          <label htmlFor={name}>{label}</label>
          {type === "phone-input" ? (
            <PhoneInput
              enableSearch={true}
              country="ro"
              autoFormat={false}
              disableSearchIcon={true}
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

      {onSubmit ? (
        <fieldset style={{ marginBottom: 0 }}>
          <button
            type="submit"
            className={isSubmitting ? "isLoading" : null}
            disabled={isSubmitting}
          >
            {submitLabel}
          </button>

          <small>{errors?.code}</small>
        </fieldset>
      ) : null}

      {onCancel ? (
        <button
          ref={focusRef}
          type="button"
          className="button-outline"
          value="cancel"
          onClick={() => {
            onCancel()
          }}
        >
          {cancelLabel}
        </button>
      ) : null}

      {footer}
    </form>
  )
}

export default Form
