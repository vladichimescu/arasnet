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

const redirect = (req, res, next) => {
  if (
    ["PUT", "DELETE"].includes(req.method) &&
    req.originalUrl.split("/").length === 2
  ) {
    res.redirect(302, `${req.originalUrl}/${req.body?.id}`)
    return
  }

  next()
}

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post(authApiPath, AuthApi.login)
server.get(authApiPath, AuthApi.resign)

server.use(AuthApi.authenticate)

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString()
  }

  if (req.method === "PUT") {
    req.body.updatedAt = new Date().toISOString()
  }

  next()
})

server.use(redirect)

server.use(employeesApiPath, (req, res, next) =>
  EmployeesApi[req.method](req, res, next)
)

server.use(consultationsApiPath, (req, res, next) =>
  ConsultationsApi[req.method](req, res, next)
)

server.use(router)

server.listen(port, () => console.log(`ARASnet Server started on port ${port}`))

const jsonServerDB = router.db
export default jsonServerDB
