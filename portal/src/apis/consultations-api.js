import Api from "./api"

const consultationApiPath = process.env.REACT_APP_SERVER_PATH_CONSULTATIONS

async function create(payload) {
  return await Api.post(consultationApiPath, payload)
}

async function read(params) {
  return await Api.get(consultationApiPath, { params })
}

async function update(payload) {
  return await Api.put(consultationApiPath, payload)
}

async function remove(payload) {
  return await Api.delete(consultationApiPath, payload)
}

const ConsultationsApi = {
  create,
  read,
  update,
  remove,
}

export default ConsultationsApi
