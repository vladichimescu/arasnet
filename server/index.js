import jsonServer from "json-server"

import AuthApi from "./apis/auth-api.js"
import ConsultationsApi from "./apis/consultations-api.js"
import EmployeesApi from "./apis/employees-api.js"

const port = process.env.SERVER_PORT
const file = process.env.DB_FILE
const authApiPath = `/${process.env.SERVER_PATH_AUTH}`
const employeesApiPath = `/${process.env.SERVER_PATH_EMPLOYEES}`
const consultationsApiPath = `/${process.env.SERVER_PATH_CONSULTATIONS}`

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(file)

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(timestamp)

//#region Public APIs
server.post(authApiPath, AuthApi.login)
server.get(authApiPath, AuthApi.resign)
//#endregion

//#region Private APIs
server.use(redirect)
server.use(AuthApi.authenticate)
server.use(AuthApi.authorize)

server.use(employeesApiPath, EmployeesApi.middleware)
server.use(consultationsApiPath, ConsultationsApi.middleware)
//#endregion

server.use(router)

server.use(errors)

server.listen(port, () => console.log(`ARASnet Server started on port ${port}`))

const jsonServerDB = router.db
export default jsonServerDB

//#region
function redirect(req, res, next) {
  if (
    ["PUT", "DELETE"].includes(req.method) &&
    req.originalUrl.split("/").length === 2
  ) {
    res.redirect(302, `${req.originalUrl}/${req.body?.id}`)
    return
  }

  next()
}

function timestamp(req, res, next) {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString()
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    req.body.updatedAt = new Date().toISOString()
  }

  next()
}

function errors(err, req, res, next) {
  res.status(500).send({
    code: "server_error",
    message: "Oops, something went wrong",
    error: err.toString(),
  })
}
//#endregion
