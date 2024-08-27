import fs from "fs"
import http from "http"
import https from "https"

const hostname = process.env.PORTAL_HOSTNAME
const port = process.env.PORTAL_PORT
const isHttps = process.env.HTTPS

const contentType = (url) => {
  const extensionIndex = url.lastIndexOf(".")
  const fileType =
    extensionIndex === -1 ? "" : url.slice(extensionIndex).toLowerCase()

  let mimeType = ""

  switch (fileType) {
    case "":
      mimeType = "text/html"
      break
    case ".html":
      mimeType = "text/html"
      break
    case ".css":
      mimeType = "text/css"
      break
    case ".js":
      mimeType = "application/javascript"
      break
    case ".json":
      mimeType = "application/json"
      break
    default:
      return ""
  }

  if (!mimeType) {
    return
  }

  return {
    "Content-Type": mimeType,
  }
}

const serve = (req, res) => {
  try {
    const data = fs.readFileSync(
      `dist${req.url.includes(".") ? req.url : "/index.html"}`
    )

    res.writeHead(200, contentType(req.url)).end(data)
  } catch {
    res.writeHead(404).end()
  }
}

if (isHttps) {
  https
    .createServer(
      {
        cert: fs.readFileSync("cert.pem"),
        key: fs.readFileSync("key.pem"),
      },
      serve
    )
    .listen(port, () => {
      console.log(`ARASnet Server available at: https://${hostname}:${port}`)
    })
} else {
  http.createServer(serve).listen(port, () => {
    console.log(`ARASnet Server available at: http://${hostname}:${port}`)
  })
}
