import api from "./api"

const employeesApiPath = "user"

async function register(account) {
  const { user } = await api.post(employeesApiPath, account)
  return user
}

async function info() {
  const { user } = await api.get(employeesApiPath)
  return user
}

const EmployeesApi = {
  register,
  info,
}

export default EmployeesApi
