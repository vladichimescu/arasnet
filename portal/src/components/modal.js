import React, { useCallback, useEffect, useRef, useState } from "react"
import { ToastContainer } from "react-toastify"

import EventService from "../services/event-service"

function Modal({ children, open, onClose = () => {} }) {
  const ref = useRef()

  const [isOpened, setIsOpened] = useState(false)

  const handleClose = useCallback(() => {
    onClose()

    setIsOpened(false)
  }, [onClose])

  useEffect(() => {
    EventService.publish("toast-global", !open)

    setIsOpened(open)
  }, [open])

  useEffect(() => {
    if (!isOpened) {
      return
    }

    ref.current.showModal()
  }, [isOpened])

  if (!isOpened) {
    return null
  }

  return (
    <dialog ref={ref} onClose={handleClose}>
      <ToastContainer autoClose={3500} closeOnClick position="top-center" />

      {children}
    </dialog>
  )
}

export default Modal
