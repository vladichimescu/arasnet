import { toCamelCase } from "@arasnet/functions"
import {
  apiActions,
  apiEmployeesEndpoint,
  apiPartnerEndpoint,
  apiPrepEndpoint,
  apiTestingEndpoint,
} from "@arasnet/types"

import StorageService from "./storage-service"

const apiEndpoints = [
  apiTestingEndpoint,
  apiEmployeesEndpoint,
  apiPrepEndpoint,
  apiPartnerEndpoint,
]

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

function getUser() {
  return StorageService.getItem({
    id: StorageService.keys.APP_AUTH_USER,
  })
}

function saveUser(user) {
  StorageService.setItem({
    id: StorageService.keys.APP_AUTH_USER,
    data: user,
  })
}

function removeUser() {
  StorageService.removeItem({
    id: StorageService.keys.APP_AUTH_USER,
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
          [toCamelCase(`can ${action} ${api}`)]: !!permissions[api]?.find(
            ([permittedAction]) => permittedAction === action
          ),
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
  getUser,
  saveUser,
  removeUser,
  getPermissions,
  savePermissions,
  removePermissions,
}

export default AuthService
