import api from "./api"

const consultationApiPath = "consultations"

async function create() {
  const data = await api.post(consultationApiPath)
  return data
}

async function read(params) {
  const data = await api.get(consultationApiPath, { params })
  return data
}

async function update() {
  const data = await api.put(consultationApiPath)
  return data
}

async function remove() {
  const data = await api.delete(consultationApiPath)
  return data
}

const ConsultationsApi = {
  create,
  read,
  update,
  remove,
}

export default ConsultationsApi
