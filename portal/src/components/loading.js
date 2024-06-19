import NProgress from "nprogress"
import React, { useEffect } from "react"

const styles = {
  fullPage: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "64px",
  },
}

function Loading() {
  useEffect(() => {
    NProgress.start()

    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <div style={styles.fullPage}>
      <div style={styles.center}>Loading</div>
    </div>
  )
}

export default Loading
