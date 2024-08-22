const apiServerUrl = process.env.SERVER_URL || process.env.REACT_APP_SERVER_URL

const apiAuthEndpoint =
  process.env.ARASNET_SERVER_AUTH_ENDPOINT ||
  process.env.REACT_APP_SERVER_AUTH_ENDPOINT

const apiConsultationsEndpoint =
  process.env.ARASNET_SERVER_CONSULTATIONS_ENDPOINT ||
  process.env.REACT_APP_SERVER_CONSULTATIONS_ENDPOINT

const apiEmployeesEndpoint =
  process.env.ARASNET_SERVER_EMPLOYEES_ENDPOINT ||
  process.env.REACT_APP_SERVER_EMPLOYEES_ENDPOINT

const apiActions = ["create", "read", "update", "remove"]

export {
  apiServerUrl,
  apiAuthEndpoint,
  apiConsultationsEndpoint,
  apiEmployeesEndpoint,
  apiActions,
}
