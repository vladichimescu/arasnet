import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import AuthApi from "../apis/auth-api"
import AuthService from "../services/auth-service"
import EventService from "../services/event-service"
import StorageService from "../services/storage-service"

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

  useEffect(() => {
    const eventId = EventService.subscribe(
      StorageService.keys.APP_AUTH_PERMISSIONS,
      () => setPermissions(AuthService.getAccessMatrix())
    )

    return () => {
      EventService.unsubscribe(eventId)
    }
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
