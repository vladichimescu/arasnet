import { mandatoryPropsCheck } from "../libs/mandatory-props-check.js"

const locations = process.env.SUPPORTED_LOCATIONS.split(",")
const consultationMandatoryFields =
  process.env.CONSULTATION_MANDATORY_FIELDS.split(",")

function createConsultation({ body: consultation = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  const errors = mandatoryPropsCheck(consultation, consultationMandatoryFields)

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

function infoConsultation({ body: consultation = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  next()
}

function updateConsultation({ body: consultation = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  const errors = mandatoryPropsCheck(consultation, consultationMandatoryFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function deleteConsultation({ body: consultation = {} }, res, next) {
  // TODO: based on user permissions, apply filters if not present already

  next()
}

export {
  createConsultation,
  infoConsultation,
  updateConsultation,
  deleteConsultation,
}
