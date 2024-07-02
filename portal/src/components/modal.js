import React, { useEffect, useRef } from "react"

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

  const onCancel = () => onClose()

  return (
    <dialog ref={ref} onClose={onCancel}>
      <form onSubmit={onSubmit}>
        {formContent}

        <button type="submit">Create</button>

        <button type="button" value="cancel" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </dialog>
  )
}

export default Modal
