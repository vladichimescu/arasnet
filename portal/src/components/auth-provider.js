import React, { createContext, useContext, useState } from "react"

import AuthApi from "../apis/auth-api"
import EmployeesApi from "../apis/employees-api"
import AuthService from "../services/auth-service"

const Context = createContext()

function AuthProvider(props) {
  const [isLogged, setIsLogged] = useState(!!AuthService.getToken())

  const state = {
    isLogged,
    login: async (account) => {
      try {
        const token = await AuthApi.login(account)
        AuthService.saveToken(token)

        setIsLogged(true)

        return token
      } catch (err) {
        setIsLogged(false)

        throw err
      }
    },
    logout: () => {
      AuthService.removeToken()

      setIsLogged(false)
    },
    register: async (account) => {
      const user = await EmployeesApi.create(account)
      state.login(account)

      return user
    },
  }

  return <Context.Provider value={state} {...props} />
}

export default AuthProvider
export const useAuth = () => useContext(Context)
