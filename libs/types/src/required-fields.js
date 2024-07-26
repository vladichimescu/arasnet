const consultationRequiredFields = (
  process.env.CONSULTATION_REQUIRED_FIELDS ||
  process.env.REACT_APP_CONSULTATION_REQUIRED_FIELDS
)?.split(",")

const employeeRequiredFields = (
  process.env.EMPLOYEE_REQUIRED_FIELDS ||
  process.env.REACT_APP_EMPLOYEE_REQUIRED_FIELDS
)?.split(",")

export { consultationRequiredFields, employeeRequiredFields }
