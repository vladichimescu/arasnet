import { apiEmployeesEndpoint } from "@arasnet/types"

import Api from "./api"

async function create(payload) {
  return await Api.post(apiEmployeesEndpoint, payload)
}

async function read(params) {
  return await Api.get(apiEmployeesEndpoint, { params })
}

async function update(payload) {
  return await Api.put(apiEmployeesEndpoint, payload)
}

async function remove(payload) {
  return await Api.delete(apiEmployeesEndpoint, payload)
}

const EmployeesApi = {
  create,
  read,
  update,
  remove,
}

export default EmployeesApi
