import React, { useCallback, useEffect, useRef, useState } from "react"

function Modal({ children, open, onClose = () => {} }) {
  const ref = useRef()

  const [isOpened, setIsOpened] = useState(open)

  const handleClose = useCallback(() => {
    onClose()

    setIsOpened(false)
  }, [onClose])

  useEffect(() => {
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
      {children}
    </dialog>
  )
}

export default Modal
