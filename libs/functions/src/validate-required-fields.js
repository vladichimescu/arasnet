function validateRequiredFields(obj = {}, fields = []) {
  const errors = {}

  fields.forEach((field) => {
    if (
      obj[field] === undefined ||
      obj[field] === null ||
      obj[field] === "" ||
      (field === "phone" && obj[field].length < 10)
    ) {
      errors[field] = `${field}_required`
    }
  })

  return errors
}

export default validateRequiredFields
