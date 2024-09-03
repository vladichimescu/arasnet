import { validateRequiredFields } from "@arasnet/functions"
import { testingRequiredFields } from "@arasnet/types"

import jsonServerDb from "../index.js"

function create({ body: testing = {} }, res, next) {
  const errors = validateRequiredFields(testing, testingRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  const testingDate = new Date(testing.date)

  if (new Date() > testingDate) {
    return res.status(400).send({
      date: "date_past",
    })
  }

  const dbTesting = jsonServerDb.testing.find(
    ({ location, date } = {}) =>
      location === testing.location && date === testing.date
  )

  if (dbTesting) {
    return res.status(400).send({
      date: "date_unavailable",
    })
  }

  if (!testing.status) {
    testing.status = "acffc089-0508-4c3f-945b-afd74376df92"
  }

  next()
}

function read({ body: testing = {}, query }, res, next) {
  next()
}

function update({ body: testing = {} }, res, next) {
  const errors = validateRequiredFields(testing, testingRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: testing = {} }, res, next) {
  next()
}

const TestingApi = {
  GET: read,
  POST: create,
  PUT: update,
  DELETE: remove,
  //TODO: check PATCH
  // PATCH: update,
  middleware: (req, res, next) => TestingApi[req.method](req, res, next),
}

export default TestingApi
