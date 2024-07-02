import StorageService from "./storage-service"

const storageKeys = StorageService.getKeys()
const authKey = storageKeys.APP_AUTH_JWT
const permissionsKey = storageKeys.APP_AUTH_PERMISSIONS

const apis = ["consultations", "employees"]
const accesses = ["create", "read", "update", "delete"]

const getToken = () => StorageService.getItem({ id: authKey })

const getAuthHeader = () => `Bearer ${getToken()}`

const saveToken = (token) =>
  StorageService.setItem({ id: authKey, data: token })

const removeToken = () => StorageService.removeItem({ id: authKey })

const getPermissions = () => StorageService.getItem({ id: permissionsKey })

const getAccessMatrix = () => {
  const permissions = getPermissions()

  return apis.reduce(
    (acc, api) => ({
      ...acc,
      ...accesses.reduce(
        (acc, access) => ({
          ...acc,
          [toCamelCase(`can ${access} ${api}`)]:
            permissions?.[api]?.access.includes(access) || false,
        }),
        {}
      ),
    }),
    {}
  )
}

const savePermissions = (permissions) =>
  StorageService.setItem({ id: permissionsKey, data: permissions })

const removePermissions = () =>
  StorageService.removeItem({ id: permissionsKey })

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
