import React, { createContext, useCallback, useContext, useState } from "react"

import AuthApi from "../apis/auth-api"
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

  return (
    <Context.Provider
      value={{
        isLogged,
        login,
        logout,
      }}
      {...props}
    />
  )
}

export default AuthProvider
export const useAuth = () => useContext(Context)
