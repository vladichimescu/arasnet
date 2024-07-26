function validateRequiredFields(obj = {}, fields = []) {
  const errors = {}

  fields.forEach((field) => {
    if (
      obj[field] === undefined ||
      obj[field] === null ||
      obj[field] === "" ||
      (field === "phone" && obj[field].length < 10)
    ) {
      errors[field] = {
        code: `${field} required`,
        message: `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`,
      }
    }
  })

  return errors
}

export default validateRequiredFields
