import api from "./api"

const consultationApiPath = process.env.REACT_APP_SERVER_PATH_CONSULTATIONS

async function create(payload) {
  return await api.post(consultationApiPath, payload)
}

async function read(params) {
  return await api.get(consultationApiPath, { params })
}

async function update(payload) {
  return await api.put(consultationApiPath, payload)
}

async function remove(payload) {
  return await api.delete(consultationApiPath, payload)
}

const ConsultationsApi = {
  create,
  read,
  update,
  remove,
}

export default ConsultationsApi
