import Api from "./api"

const employeesApiPath = process.env.REACT_APP_SERVER_PATH_EMPLOYEES

async function create(payload) {
  return await Api.post(employeesApiPath, payload)
}

async function read(params) {
  return await Api.get(employeesApiPath, { params })
}

async function update(payload) {
  return await Api.put(employeesApiPath, payload)
}

async function remove(payload) {
  return await Api.delete(employeesApiPath, payload)
}

const EmployeesApi = {
  create,
  read,
  update,
  remove,
}

export default EmployeesApi
