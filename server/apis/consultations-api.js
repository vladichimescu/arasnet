import { validateRequiredFields } from "@arasnet/functions"
import { consultationRequiredFields } from "@arasnet/types"

function create({ body: consultation = {} }, res, next) {
  const errors = validateRequiredFields(
    consultation,
    consultationRequiredFields
  )

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const consultationDate = new Date(consultation.date)

  if (new Date() > consultationDate) {
    return res.status(400).send({
      date: "date_past",
    })
  }

  if (!consultation.status) {
    consultation.status = "acffc089-0508-4c3f-945b-afd74376df92"
  }

  next()
}

function read({ body: consultation = {}, query }, res, next) {
  next()
}

function update({ body: consultation = {} }, res, next) {
  const errors = validateRequiredFields(
    consultation,
    consultationRequiredFields
  )

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
