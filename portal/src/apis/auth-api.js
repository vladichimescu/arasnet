import { apiAuthEndpoint } from "@arasnet/types"

import Api from "./api"

async function login(account) {
  return await Api.post(apiAuthEndpoint, account)
}

async function resign() {
  return await Api.get(apiAuthEndpoint)
}

async function restart() {
  return await Api.delete(apiAuthEndpoint)
}

const AuthApi = {
  login,
  resign,
  restart,
}

export default AuthApi
