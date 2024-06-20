import api from "./api"

const authApiPath = process.env.REACT_APP_SERVER_PATH_AUTH

async function login(account) {
  return await api.post(authApiPath, account)
}

async function resign() {
  return await api.get(authApiPath)
}

const AuthApi = {
  login,
  resign,
}

export default AuthApi
