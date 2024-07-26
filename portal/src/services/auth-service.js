import { toCamelCase } from "@arasnet/functions"
import { apiActions, apiEndpoints, locations } from "@arasnet/types"

import StorageService from "./storage-service"

function getToken() {
  return StorageService.getItem({
    id: StorageService.keys.APP_AUTH_JWT,
  })
}

function saveToken(token) {
  StorageService.setItem({
    id: StorageService.keys.APP_AUTH_JWT,
    data: token,
  })
}

function removeToken() {
  StorageService.removeItem({
    id: StorageService.keys.APP_AUTH_JWT,
  })
}

function getPermissions() {
  const permissions =
    StorageService.getItem({
      id: StorageService.keys.APP_AUTH_PERMISSIONS,
    }) || {}

  const access = apiEndpoints.reduce(
    (acc, api) => ({
      ...acc,
      ...apiActions.reduce(
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

function savePermissions(permissions) {
  StorageService.setItem({
    id: StorageService.keys.APP_AUTH_PERMISSIONS,
    data: permissions,
  })
}

function removePermissions() {
  StorageService.removeItem({
    id: StorageService.keys.APP_AUTH_PERMISSIONS,
  })
}

const AuthService = {
  getToken,
  saveToken,
  removeToken,
  getPermissions,
  savePermissions,
  removePermissions,
}

export default AuthService
