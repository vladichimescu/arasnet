import { apiConsultationsEndpoint } from "@arasnet/types"

import Api from "./api"

async function create(payload) {
  return await Api.post(apiConsultationsEndpoint, payload)
}

async function read(params) {
  return await Api.get(apiConsultationsEndpoint, { params })
}

async function update(payload) {
  return await Api.put(apiConsultationsEndpoint, payload)
}

async function remove(payload) {
  return await Api.delete(apiConsultationsEndpoint, payload)
}

const ConsultationsApi = {
  create,
  read,
  update,
  remove,
}

export default ConsultationsApi
