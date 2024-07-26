import NProgress from "nprogress"
import React, { useEffect } from "react"

import classes from "./loading.module.scss"

function Loading({ isLoading = true }) {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  if (!isLoading) {
    return null
  }

  return (
    <div className={classes.loading}>
      <h1>Loading</h1>
      <section>
        <small>updating modules</small>
        <small>generating structure</small>
        <small>loading api data</small>
        <small>processing models</small>
        <small>rendering ui views</small>
      </section>
    </div>
  )
}

export default Loading
