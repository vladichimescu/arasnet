import api from "./api"

const authApiPath = "auth"

async function login(account) {
  const { token } = await api.post(authApiPath, account)
  return token
}

async function resign() {
  const { token } = await api.get(authApiPath)
  return token
}

const AuthApi = {
  login,
  resign,
}

export default AuthApi
