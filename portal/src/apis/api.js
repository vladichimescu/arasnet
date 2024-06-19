import axios from "axios"

import AuthService from "../services/auth-service"

import AuthApi from "./auth-api"

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
})

api.interceptors.request.use((config) => {
  config.headers.authorization = AuthService.getAuthHeader()

  return config
})

let isResigning = false
let stalledRequestConfigs = []

api.interceptors.response.use(
  ({ data }) => data,
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

    throw data
  }
)

export default api
