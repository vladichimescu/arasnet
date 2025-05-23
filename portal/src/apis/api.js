import axios from "axios"
import NProgress from "nprogress"
import { toast } from "react-toastify"

import { i18n } from "@arasnet/i18n"
import { apiServerUrl } from "@arasnet/types"

import AuthService from "../services/auth-service"

import AuthApi from "./auth-api"

const Api = axios.create({
  baseURL: apiServerUrl,
})

Api.interceptors.request.use(interceptRequestSuccess, interceptRequestError)

Api.interceptors.response.use(interceptResponseSuccess, interceptResponseError)

export default Api

//#region
function interceptRequestSuccess(config) {
  NProgress.start()

  config.headers.authorization = `Bearer ${AuthService.getToken()}`
  config.headers.language = i18n.resolvedLanguage

  return config
}

function interceptRequestError(error) {
  NProgress.done()

  throw error
}

function interceptResponseSuccess({ data }) {
  NProgress.done()

  return data
}

function interceptResponseError({
  response: { status, data = {} } = {},
  config,
}) {
  if (!status) {
    toast.error(i18n.t("generic.error.network_error"))
  } else if (status === 400) {
    Object.values(data)
      .map(({ message }) => message)
      .forEach(toast.warn)
  } else if (status === 401) {
    if (data.code === i18n.t("generic.error.authentication_expired").code) {
      return resign(config)
    }

    toast.error(data.message)

    window.location.href = "/logout"
  } else if (status === 403) {
    toast.error(data.message)
  } else if (status === 500) {
    toast.error(data.message)
  }

  NProgress.done()

  throw data
}

let isResigning = false
let stalledRequestConfigs = []

async function resign(requestConfig) {
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

  const { token, permissions } = await AuthApi.resign()

  AuthService.saveToken(token)
  AuthService.savePermissions(permissions)

  isResigning = false

  stalledRequestConfigs.forEach(({ stalledRequestConfig, resolve, reject }) => {
    Api(stalledRequestConfig)
      .then((response) => resolve(response))
      .catch((err) => reject(err))
  })

  return Api(requestConfig)
}
//#endregion
