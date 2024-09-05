import { validateRequiredFields } from "@arasnet/functions"
import { prepRequiredFields } from "@arasnet/types"

import jsonServerDb from "../index.js"

function create({ body: prep = {} }, res, next) {
  const errors = validateRequiredFields(prep, prepRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const prepDate = new Date(prep.date)

  if (new Date() > prepDate) {
    return res.status(400).send({
      date: "date_past",
    })
  }

  const dbPrep = jsonServerDb.prep.find(
    ({ location, date } = {}) =>
      location === prep.location && date === prep.date
  )

  if (dbPrep) {
    return res.status(400).send({
      date: "date_unavailable",
    })
  }

  if (!prep.status) {
    prep.status = "503e61f7-5c33-492b-9713-747b488db888"
  }

  next()
}

function read({ body: prep = {}, query }, res, next) {
  next()
}

function update({ body: prep = {} }, res, next) {
  const errors = validateRequiredFields(prep, prepRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: prep = {} }, res, next) {
  next()
}

const PrepApi = {
  GET: read,
  POST: create,
  PUT: update,
  DELETE: remove,
  //TODO: check PATCH
  // PATCH: update,
  middleware: (req, res, next) => PrepApi[req.method](req, res, next),
}

export default PrepApi
