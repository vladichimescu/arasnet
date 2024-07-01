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
  }, [open])

  const onSubmit = async (event) => {
    event.preventDefault()

    const form = event.target
    const data = Object.fromEntries(new FormData(form))

    onClose(data)
  }

  const onCancel = () => onClose()

  return (
    <dialog ref={ref} onClose={onCancel}>
      <form onSubmit={onSubmit}>
        {formContent}

        <button type="submit" value="submit">
          Create
        </button>

        <button type="button" value="no" onClick={onCancel} autoFocus>
          Cancel
        </button>
      </form>
    </dialog>
  )
}

export default Modal
