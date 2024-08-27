const apiServerUrl = `${process.env.REACT_APP_HTTPS || process.env.HTTPS ? "https" : "http"}://${process.env.SERVER_HOSTNAME || process.env.REACT_APP_SERVER_HOSTNAME}:${process.env.SERVER_PORT || process.env.REACT_APP_SERVER_PORT}`

const apiAuthEndpoint =
  process.env.SERVER_AUTH_ENDPOINT || process.env.REACT_APP_SERVER_AUTH_ENDPOINT

const apiConsultationsEndpoint =
  process.env.SERVER_CONSULTATIONS_ENDPOINT ||
  process.env.REACT_APP_SERVER_CONSULTATIONS_ENDPOINT

const apiEmployeesEndpoint =
  process.env.SERVER_EMPLOYEES_ENDPOINT ||
  process.env.REACT_APP_SERVER_EMPLOYEES_ENDPOINT

const apiActions = ["create", "read", "update", "remove"]

export {
  apiServerUrl,
  apiAuthEndpoint,
  apiConsultationsEndpoint,
  apiEmployeesEndpoint,
  apiActions,
}
