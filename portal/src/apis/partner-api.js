import { apiPartnerEndpoint } from "@arasnet/types"

import Api from "./api"

async function create(payload) {
  return await Api.post(apiPartnerEndpoint, payload)
}

async function read(params) {
  return await Api.get(apiPartnerEndpoint, { params })
}

async function update(payload) {
  return await Api.put(apiPartnerEndpoint, payload)
}

async function remove(payload) {
  return await Api.delete(apiPartnerEndpoint, payload)
}

const PrepApi = {
  create,
  read,
  update,
  remove,
}

export default PrepApi
