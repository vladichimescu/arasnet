import jsonServerDB from "../index.js"
import { checkMandatoryProps } from "../libs/check-mandatory-props.js"

const supportedLocations = process.env.SUPPORTED_LOCATIONS.split(",")
const consultationMandatoryFields =
  process.env.CONSULTATION_MANDATORY_FIELDS.split(",")

function create({ body: consultation = {} }, res, next) {
  const errors = checkMandatoryProps(consultation, consultationMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const dbConsultation = jsonServerDB
    .getState()
    .consultations.find(
      ({ phone, date, location } = {}) =>
        phone === consultation.phone &&
        date === consultation.date &&
        location === consultation.location
    )

  if (dbConsultation) {
    return res.status(400).send({
      date: {
        code: "date_invalid",
        message: "consultation already exists",
      },
    })
  }

  next()
}

function read({ body: consultation = {}, query }, res, next) {
  next()
}

function update({ body: consultation = {} }, res, next) {
  const errors = checkMandatoryProps(consultation, consultationMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: consultation = {} }, res, next) {
  next()
}

const ConsultationsApi = {
  GET: read,
  POST: create,
  PUT: update,
  DELETE: remove,
  //TODO: check PATCH
  // PATCH: update,
  middleware: (req, res, next) => ConsultationsApi[req.method](req, res, next),
}

export default ConsultationsApi
