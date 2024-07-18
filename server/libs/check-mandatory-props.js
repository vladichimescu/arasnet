function checkMandatoryProps(obj = {}, mandatoryProps = []) {
  const errors = {}

  mandatoryProps.forEach((iProp) => {
    if (
      obj[iProp] === undefined ||
      obj[iProp] === null ||
      obj[iProp] === "" ||
      (iProp === "phone" && obj[iProp].length < 10)
    ) {
      errors[iProp] = {
        code: `${iProp} required`,
        message: `${iProp.charAt(0).toUpperCase()}${iProp.slice(1)} is required`,
      }
    }
  })

  return errors
}

export { checkMandatoryProps }
