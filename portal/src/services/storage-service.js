import EventService from "./event-service"

const appKeyPrefix = "__arasnet__"
const vwoKeyPrefix = "__vwo__"
const trackingKeyPrefix = "__tracking__"

const storageKeys = {
  APP_AUTH_JWT: `${appKeyPrefix}__auth_jwt`,
  APP_AUTH_PERMISSIONS: `${appKeyPrefix}__auth_permissions`,
  APP_TERMS_AND_CONDITIONS_DISMISSED: `${appKeyPrefix}__terms_and_conditions--dismissed`,
  APP_CONTACT_SERVICE_USAGE_DISMISSED: `${appKeyPrefix}__contact_service_usage--dismissed`,

  TRACKING_PAGES: `${trackingKeyPrefix}__tracking_pages`,

  VWO_THEME_VARIANT: `${vwoKeyPrefix}__theme_variant`,
}

// TODO: add cookie support
const storageTypes = {
  LOCAL: "localStorage",
  SESSION: "sessionStorage",
}

function getItem({ id, type = storageTypes.LOCAL }) {
  const data =
    type instanceof Array
      ? window[type.find((storage) => window[storage].getItem(id))]?.getItem(id)
      : window[type].getItem(id)

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

function setItem({ id, data: payload, type = storageTypes.LOCAL }) {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload)

  type instanceof Array
    ? type.forEach((storage) => window[storage].setItem(id, data))
    : window[type].setItem(id, data)

  EventService.publish(id)
}

function removeItem({ id, type = storageTypes.LOCAL }) {
  type instanceof Array
    ? type.forEach((storage) => window[storage].removeItem(id))
    : window[type].removeItem(id)
}

function removeAll({ type = storageTypes.LOCAL }) {
  Object.values(storageKeys).forEach((id) => removeItem({ id, type }))
}

const StorageService = {
  get types() {
    return storageTypes
  },
  get keys() {
    return storageKeys
  },
  getItem,
  setItem,
  removeItem,
  removeAll,
}

export default StorageService
