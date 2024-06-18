import axios from "axios"

import AuthService from "../services/auth-service"

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const register = async (account) => {
  try {
    const { user } = await axios.post(`${SERVER_URL}/user`, account)

    return user
  } catch (error) {
    throw error
  }
}

const info = async () => {
  try {
    const { user } = await axios.get(`${SERVER_URL}/user`, {
      headers: AuthService.getAuthHeader(),
    })

    return user
  } catch (error) {
    throw error
  }
}

const EmployeesApi = {
  register,
  info,
}

export default EmployeesApi
