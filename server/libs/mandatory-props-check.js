function mandatoryPropsCheck(obj = {}, mandatoryProps = []) {
  const errors = {}

  mandatoryProps.forEach((iProp) => {
    if (obj[iProp] === undefined || obj[iProp] === "") {
      errors[iProp] = {
        code: `${iProp}_required`,
        message: `${iProp} required`,
      }
    }
  })

  return errors
}

export { mandatoryPropsCheck }
