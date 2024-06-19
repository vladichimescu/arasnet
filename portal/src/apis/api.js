import axios from "axios"
import NProgress from "nprogress"

import AuthService from "../services/auth-service"

import AuthApi from "./auth-api"

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
})

api.interceptors.request.use(
  (config) => {
    NProgress.start()

    config.headers.authorization = AuthService.getAuthHeader()

    return config
  },
  (error) => {
    NProgress.done()

    throw error
  }
)

let isResigning = false
let stalledRequestConfigs = []

api.interceptors.response.use(
  ({ data }) => {
    NProgress.done()

    return data
  },
  async ({ response: { status, data = {} } = {}, config: requestConfig }) => {
    if (status === 401) {
      if (data.code === "authentication_expired") {
        if (isResigning) {
          return new Promise((resolve, reject) => {
            stalledRequestConfigs.push({
              stalledRequestConfig: requestConfig,
              resolve,
              reject,
            })
          })
        }

        isResigning = true

        const token = await AuthApi.resign()
        AuthService.saveToken(token)

        stalledRequestConfigs.forEach(
          ({ stalledRequestConfig, resolve, reject }) => {
            api(stalledRequestConfig)
              .then((response) => resolve(response))
              .catch((err) => reject(err))
          }
        )

        return api(requestConfig)
      }

      window.location.href = "/logout"
    } else if (status === 400) {
      // TODO: Handle business validation
    } else if (status === 404) {
      // TODO: Handle not found errors
    } else {
      // TODO: Handle other errors
    }

    NProgress.done()

    throw data
  }
)

export default api
