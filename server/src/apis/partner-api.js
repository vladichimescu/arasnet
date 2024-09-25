import { validateRequiredFields } from "@arasnet/functions"
import { partnerRequiredFields } from "@arasnet/types"

function create({ body: partner = {} }, res, next) {
  const errors = validateRequiredFields(partner, partnerRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  partner.contacts = partner.contacts.reduce((acc, item, index) => {
    if (index % 2 === 0) {
      acc.push([item])
    } else {
      acc[Math.floor(index / 2)].push(item)
    }

    return acc
  }, [])

  if (typeof partner.confirmation !== "boolean") {
    partner.confirmation = partner.confirmation === "true" ? true : false
  }

  if (!partner.status) {
    partner.status = "b65becc6-6b10-44a7-866e-4dfa3c686f8e"
  }

  next()
}

function read({ body: partner = {}, query }, res, next) {
  next()
}

function update({ body: partner = {} }, res, next) {
  const errors = validateRequiredFields(partner, partnerRequiredFields)

  if (Object.keys(errors).length) {
    return res.status(400).send(errors)
  }

  next()
}

function remove({ body: partner = {} }, res, next) {
  next()
}

const PartnerApi = {
  GET: read,
  POST: create,
  PUT: update,
  DELETE: remove,
  //TODO: check PATCH
  // PATCH: update,
  middleware: (req, res, next) => PartnerApi[req.method](req, res, next),
}

export default PartnerApi
