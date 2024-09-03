import { apiTestingEndpoint } from "@arasnet/types"

import Api from "./api"

async function create(payload) {
  return await Api.post(apiTestingEndpoint, payload)
}

async function read(params) {
  return await Api.get(apiTestingEndpoint, { params })
}

async function update(payload) {
  return await Api.put(apiTestingEndpoint, payload)
}

async function remove(payload) {
  return await Api.delete(apiTestingEndpoint, payload)
}

const TestingApi = {
  create,
  read,
  update,
  remove,
}

export default TestingApi
