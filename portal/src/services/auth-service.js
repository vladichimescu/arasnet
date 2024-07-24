import { locations } from "@arasnet/types"

import StorageService from "./storage-service"

const apis = [
  process.env.REACT_APP_SERVER_PATH_EMPLOYEES,
  process.env.REACT_APP_SERVER_PATH_CONSULTATIONS,
]
const actions = ["create", "read", "update", "delete"]

const getToken = () =>
  StorageService.getItem({ id: StorageService.keys.APP_AUTH_JWT })

const getAuthHeader = () => `Bearer ${getToken()}`

const saveToken = (token) =>
  StorageService.setItem({ id: StorageService.keys.APP_AUTH_JWT, data: token })

const removeToken = () =>
  StorageService.removeItem({ id: StorageService.keys.APP_AUTH_JWT })

const getPermissions = () =>
  StorageService.getItem({ id: StorageService.keys.APP_AUTH_PERMISSIONS })

const getAccessMatrix = () => {
  const permissions = getPermissions() || {}

  const access = apis.reduce(
    (acc, api) => ({
      ...acc,
      ...actions.reduce(
        (acc, action) => ({
          ...acc,
          [toCamelCase(`can ${action} ${api}`)]:
            Object.entries(permissions).filter(
              ([location, apis]) =>
                Object.keys(locations).includes(location) &&
                apis[api]?.includes(action)
            ).length !== 0,
        }),
        {}
      ),
    }),
    {}
  )

  return {
    permissions,
    ...access,
  }
}

const savePermissions = (permissions) =>
  StorageService.setItem({
    id: StorageService.keys.APP_AUTH_PERMISSIONS,
    data: permissions,
  })

const removePermissions = () =>
  StorageService.removeItem({ id: StorageService.keys.APP_AUTH_PERMISSIONS })

const AuthService = {
  getToken,
  getAuthHeader,
  saveToken,
  removeToken,
  getPermissions,
  getAccessMatrix,
  savePermissions,
  removePermissions,
}

export default AuthService

//#region
function toCamelCase(string, delimiter = " ") {
  return string
    .split(delimiter)
    .map((word, index) =>
      index === 0 ? word : `${word[0].toUpperCase()}${word.slice(1)}`
    )
    .join("")
}
//#endregion
