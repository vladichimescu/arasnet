import api from "./api"

const consultationApiPath = process.env.REACT_APP_SERVER_PATH_CONSULTATIONS

async function create() {
  return await api.post(consultationApiPath)
}

async function read(params) {
  return await api.get(consultationApiPath, { params })
}

async function update() {
  return await api.put(consultationApiPath)
}

async function remove() {
  return await api.delete(consultationApiPath)
}

const ConsultationsApi = {
  create,
  read,
  update,
  remove,
}

export default ConsultationsApi
