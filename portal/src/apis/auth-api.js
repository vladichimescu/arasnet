import { apiAuthEndpoint } from "@arasnet/types"

import Api from "./api"

async function login(account) {
  return await Api.post(apiAuthEndpoint, account)
}

async function resign() {
  return await Api.get(apiAuthEndpoint)
}

const AuthApi = {
  login,
  resign,
}

export default AuthApi
