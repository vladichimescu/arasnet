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

server.post(authApiPath, AuthApi.login)
server.get(authApiPath, AuthApi.resign)

server.use(AuthApi.auth)

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString()
  }

  if (req.method === "PUT") {
    req.body.updatedAt = new Date().toISOString()
  }

  next()
})

server.post(employeesApiPath, EmployeesApi.create)
server.get(employeesApiPath, EmployeesApi.read)
server.put(employeesApiPath, (req, res, next) =>
  EmployeesApi.update(req, res, () =>
    res.redirect(302, `${employeesApiPath}/${req.body.id}`)
  )
)
server.delete(employeesApiPath, (req, res, next) =>
  EmployeesApi.remove(req, res, () =>
    res.redirect(302, `${employeesApiPath}/${req.body.id}`)
  )
)

server.post(consultationsApiPath, ConsultationsApi.create)
server.get(consultationsApiPath, ConsultationsApi.read)
server.put(consultationsApiPath, (req, res, next) =>
  ConsultationsApi.update(req, res, () =>
    res.redirect(302, `${consultationsApiPath}/${req.body.id}`)
  )
)
server.delete(consultationsApiPath, (req, res, next) =>
  ConsultationsApi.remove(req, res, () =>
    res.redirect(302, `${consultationsApiPath}/${req.body.id}`)
  )
)

server.use(router)

server.listen(port, () => console.log(`ARASnet Server started on port ${port}`))

const jsonServerDB = router.db
export default jsonServerDB
