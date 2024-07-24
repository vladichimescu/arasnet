import Api from "./api"

const authApiPath = process.env.REACT_APP_SERVER_PATH_AUTH

async function login(account) {
  return await Api.post(authApiPath, account)
}

async function resign() {
  return await Api.get(authApiPath)
}

const AuthApi = {
  login,
  resign,
}

export default AuthApi
