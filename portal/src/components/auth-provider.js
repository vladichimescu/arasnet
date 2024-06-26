import React, { createContext, useCallback, useContext, useState } from "react"

import AuthApi from "../apis/auth-api"
import EmployeesApi from "../apis/employees-api"
import AuthService from "../services/auth-service"

const Context = createContext()

function AuthProvider(props) {
  const [isLogged, setIsLogged] = useState(!!AuthService.getToken())

  const login = useCallback(async (account) => {
    const token = await AuthApi.login(account)
    AuthService.saveToken(token)

    setIsLogged(true)

    return token
  }, [])

  const logout = useCallback(() => {
    AuthService.removeToken()

    setIsLogged(false)
  }, [])

  const register = useCallback(async (account) => {
    const user = await EmployeesApi.create(account)
    login(account)

    return user
  }, [])

  return (
    <Context.Provider
      value={{
        isLogged,
        login,
        logout,
        register,
      }}
      {...props}
    />
  )
}

export default AuthProvider
export const useAuth = () => useContext(Context)
