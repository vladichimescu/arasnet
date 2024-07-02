import React, { createContext, useCallback, useContext, useState } from "react"

import AuthApi from "../apis/auth-api"
import AuthService from "../services/auth-service"

const Context = createContext()

function AuthProvider(props) {
  const [isLogged, setIsLogged] = useState(!!AuthService.getToken())
  const [permissions, setPermissions] = useState(AuthService.getAccessMatrix())

  const login = useCallback(async (account) => {
    const { token, permissions } = await AuthApi.login(account)

    AuthService.saveToken(token)
    AuthService.savePermissions(permissions)

    setPermissions(AuthService.getAccessMatrix())

    setIsLogged(true)
  }, [])

  const logout = useCallback(() => {
    AuthService.removeToken()
    AuthService.removePermissions()

    setPermissions(AuthService.getAccessMatrix())

    setIsLogged(false)
  }, [])

  return (
    <Context.Provider
      value={{
        isLogged,
        ...permissions,
        login,
        logout,
      }}
      {...props}
    />
  )
}

export default AuthProvider
export const useAuth = () => useContext(Context)
