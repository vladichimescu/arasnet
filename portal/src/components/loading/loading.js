import NProgress from "nprogress"
import React, { useEffect } from "react"

import classes from "./loading.module.scss"

function Loading({ fullPage, isLoading = true }) {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  if (!isLoading) {
    return null
  }

  if (fullPage) {
    return (
      <div className={classes.fullPage}>
        <div className={classes.backdrop} />
        <div className={classes.loader} />
      </div>
    )
  }

  return <div className={classes.loader} />
}

export default Loading
