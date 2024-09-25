import React, { Fragment, useEffect, useRef, useState } from "react"
import PhoneInput from "react-phone-input-2"
import { toast } from "react-toastify"

import { i18n } from "@arasnet/i18n"

import MultiSelectInput from "../multi-select-input"

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
      const formData = new FormData(event.target)

      const data = {}
      for (const key of formData.keys()) {
        const value = formData.getAll(key).filter(Boolean)

        data[key] = value.length > 1 ? value : value[0]
      }

      await onSubmit(data)
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

      {inputs?.map(({ type, name, label, valueLabel, list, ...props }) => (
        <fieldset
          key={name}
          style={{
            display: type === "multi-select-input" ? "contents" : null,
          }}
        >
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
          ) : type === "multi-select-input" ? (
            <MultiSelectInput name={name} list={list} {...props} />
          ) : type === "bool" ? (
            <Fragment>
              <input
                id={`${name}-true`}
                name={name}
                type="radio"
                value={true}
                {...props}
              />
              <label htmlFor={`${name}-true`}>
                {i18n.t("generic.boolean.yes")}
              </label>

              <input
                id={`${name}-false`}
                name={name}
                type="radio"
                value={false}
                {...props}
              />
              <label htmlFor={`${name}-false`}>
                {i18n.t("generic.boolean.no")}
              </label>
            </Fragment>
          ) : (
            <Fragment>
              <input id={name} name={name} type={type} {...props} />
              {valueLabel ? <label htmlFor={name}>{valueLabel}</label> : null}
            </Fragment>
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
