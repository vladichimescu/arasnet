const testingRequiredFields = (
  process.env.TESTING_REQUIRED_FIELDS ||
  process.env.REACT_APP_TESTING_REQUIRED_FIELDS
)?.split(",")

const employeeRequiredFields = (
  process.env.EMPLOYEE_REQUIRED_FIELDS ||
  process.env.REACT_APP_EMPLOYEE_REQUIRED_FIELDS
)?.split(",")

const prepRequiredFields = (
  process.env.PREP_REQUIRED_FIELDS || process.env.REACT_APP_PREP_REQUIRED_FIELDS
)?.split(",")

export { testingRequiredFields, employeeRequiredFields, prepRequiredFields }
