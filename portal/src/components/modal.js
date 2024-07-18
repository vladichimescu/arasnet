import React, { useCallback, useEffect, useRef, useState } from "react"
import { ToastContainer } from "react-toastify"

import { useActions } from "./actions-provider"

function Modal({ children, open, onClose = () => {} }) {
  const ref = useRef()

  const {
    actions: [toastGlobal],
  } = useActions("toast-global")

  const [isOpened, setIsOpened] = useState(false)

  const handleClose = useCallback(() => {
    onClose()

    setIsOpened(false)
  }, [onClose])

  useEffect(() => {
    toastGlobal?.handler(!open)

    setIsOpened(open)
  }, [open, toastGlobal])

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
