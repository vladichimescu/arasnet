import React, { useEffect, useRef } from "react"

import classes from "./modal.module.css"

function Modal({ open, onClose, formContent }) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (!open) {
      ref.current.close()

      return
    }

    ref.current.querySelector("form").reset()
    ref.current.showModal()
    ref.current.querySelector("button[value='cancel']").focus()
  }, [open])

  const onSubmit = async (event) => {
    event.preventDefault()

    onClose(Object.fromEntries(new FormData(event.target)))
  }

  if (!open) {
    return null
  }

  return (
    <dialog className={classes.dialog} ref={ref} onClose={() => onClose()}>
      <form className={classes.form} onSubmit={onSubmit}>
        {formContent}

        <div className={classes.formActions}>
          <button type="submit">Create</button>

          <button type="button" value="cancel" onClick={() => onClose()}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Modal
