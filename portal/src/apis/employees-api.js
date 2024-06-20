import api from "./api"

const employeesApiPath = process.env.REACT_APP_SERVER_PATH_EMPLOYEES

async function create(payload) {
  return await api.post(employeesApiPath, payload)
}

async function read(params) {
  return await api.get(employeesApiPath, { params })
}

async function update(payload) {
  return await api.put(employeesApiPath, payload)
}

async function remove(payload) {
  return await api.delete(employeesApiPath, payload)
}

const EmployeesApi = {
  create,
  read,
  update,
  remove,
}

export default EmployeesApi
