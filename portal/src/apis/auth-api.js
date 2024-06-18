import axios from "axios"

import AuthService from "../services/auth-service"

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const login = async (account) => {
  try {
    const { token } = await axios.post(`${SERVER_URL}/auth`, account)

    return token
  } catch (error) {
    throw error
  }
}

const resign = async () => {
  try {
    const { token } = await axios.get(`${SERVER_URL}/auth`)

    return token
  } catch (error) {
    throw error
  }
}

const AuthApi = {
  login,
  resign,
}

export default AuthApi
