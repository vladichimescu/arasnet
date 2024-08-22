import jsonServer from "json-server"

import { i18n } from "@arasnet/i18n"
import {
  apiAuthEndpoint,
  apiConsultationsEndpoint,
  apiEmployeesEndpoint,
} from "@arasnet/types"

import AuthApi from "./apis/auth-api.js"
import ConsultationsApi from "./apis/consultations-api.js"
import EmployeesApi from "./apis/employees-api.js"

const port = process.env.ARASNET_SERVER_PORT
const file = process.env.ARASNET_DB_FILE

const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const router = jsonServer.router(file)

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(redirect)
server.use(timestamp)
server.use(i18nErrors)

//#region Public APIs
server.post(`/${apiAuthEndpoint}`, AuthApi.login)
server.get(`/${apiAuthEndpoint}`, AuthApi.resign)
//#endregion

//#region Private APIs
server.use(AuthApi.authenticate)

server.delete(`/${apiAuthEndpoint}/undefined`, AuthApi.restart)

server.use(AuthApi.authorize)

server.use(`/${apiEmployeesEndpoint}`, EmployeesApi.middleware)
server.use(`/${apiConsultationsEndpoint}`, ConsultationsApi.middleware)
//#endregion

server.use(router)

server.use(errors)

server.listen(port, () => {
  console.log(`ARASnet Server started on port ${port}`)
})

const jsonServerDb = {
  get consultations() {
    return router.db.getState().consultations
  },
  get employees() {
    return router.db.getState().employees
  },
}

export default jsonServerDb

//#region
function redirect(req, res, next) {
  if (
    ["PUT", "DELETE"].includes(req.method) &&
    req.originalUrl.split("/").length === 2
  ) {
    res.redirect(308, `${req.originalUrl}/${req.body?.id}`)
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

function i18nErrors(req, res, next) {
  const language = req.headers?.language

  const i18nT = Object.keys(i18n.options.resources).includes(language)
    ? i18n.getFixedT(language)
    : i18n.t

  const _send = res.send

  res.send = function (body, error) {
    if ([4, 5].includes(parseInt(res.statusCode / 100))) {
      const _body =
        typeof body === "string"
          ? {
              ...i18nT(`generic.error.${body}`),
              error,
            }
          : Object.entries(body).reduce(
              (acc, [field, i18nError]) => ({
                ...acc,
                [field]:
                  typeof i18nError === "string" && !i18nError.includes(" ")
                    ? i18nT(`generic.error.${i18nError}`)
                    : i18nError,
              }),
              {}
            )

      return _send.call(this, JSON.stringify(_body))
    }

    return _send.call(this, body)
  }

  next()
}

function errors(err, req, res, next) {
  res.status(500).send("server_error", err.toString())
}
//#endregion
