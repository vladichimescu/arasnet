import jsonServer from "json-server"

import { auth, login, resign } from "./apis/auth.js"
import {
  createConsultation,
  deleteConsultation,
  infoConsultation,
  updateConsultation,
} from "./apis/consultation.js"
import {
  deleteEmployee,
  infoEmployee,
  registerEmployee,
  updateEmployee,
} from "./apis/employee.js"

const port = process.env.SERVER_PORT
const file = process.env.DB_FILE

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(file)

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post("/auth", login)
server.get("/auth", resign)

server.use(auth)

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString()
  }

  if (req.method === "PUT") {
    req.body.updatedAt = new Date().toISOString()
  }

  next()
})

// server.post("/employees", registerEmployee)
// server.get("/employees", infoEmployee)
// server.patch("/employees", updateEmployee)
// server.delete("/employees", deleteEmployee)

// server.post("/consultations", createConsultation)
// server.get("/consultations", infoConsultation)
// server.patch("/consultations", updateConsultation)
// server.delete("/consultations", deleteConsultation)

server.use(router)

server.listen(port, () => console.log(`ARASnet Server started on port ${port}`))

const jsonServerDB = router.db
export default jsonServerDB
