import { apiPrepEndpoint } from "@arasnet/types"

import Api from "./api"

async function create(payload) {
  return await Api.post(apiPrepEndpoint, payload)
}

async function read(params) {
  return await Api.get(apiPrepEndpoint, { params })
}

async function update(payload) {
  return await Api.put(apiPrepEndpoint, payload)
}

async function remove(payload) {
  return await Api.delete(apiPrepEndpoint, payload)
}

const PrepApi = {
  create,
  read,
  update,
  remove,
}

export default PrepApi
