const appStorageKeyPrefix = "__arasnet__"
const vwoStorageKeyPrefix = "__vwo__"
const trackingStorageKeyPrefix = "__tracking__"

const storageKeys = {
  APP_AUTH_JWT: `${appStorageKeyPrefix}.auth_jwt`,
  APP_TERMS_AND_CONDITIONS_DISMISSED: `${appStorageKeyPrefix}.terms_and_conditions-dismissed`,
  APP_CONTACT_SERVICE_USAGE_DISMISSED: `${appStorageKeyPrefix}.contact.service_usage-dismissed`,

  TRACKING_PAGES: `${trackingStorageKeyPrefix}.tracking.pages`,

  VWO_THEME_VARIANT: `${vwoStorageKeyPrefix}.theme_variant`,
}

// TODO: add cookie support
const storageTypes = {
  LOCAL: "localStorage",
  SESSION: "sessionStorage",
}

const getKeys = () => storageKeys

const getTypes = () => storageTypes

const getItem = ({ id, storageType = storageTypes.LOCAL }) => {
  const data =
    storageType instanceof Array
      ? window[
          storageType.find((storage) => window[storage].getItem(id))
        ]?.getItem(id)
      : window[storageType].getItem(id)

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

const setItem = ({ id, data: payload, storageType = storageTypes.LOCAL }) => {
  const data = typeof payload === "string" ? payload : JSON.stringify(payload)

  storageType instanceof Array
    ? storageType.forEach((storage) => window[storage].setItem(id, data))
    : window[storageType].setItem(id, data)
}

const removeItem = ({ id, storageType = storageTypes.LOCAL }) => {
  storageType instanceof Array
    ? storageType.forEach((storage) => window[storage].removeItem(id))
    : window[storageType].removeItem(id)
}

const removeAll = ({ storageType = storageTypes.LOCAL }) => {
  Object.values(storageKeys).forEach((id) => removeItem({ id, storageType }))
}

const StorageService = {
  getTypes,
  getKeys,
  getItem,
  setItem,
  removeItem,
  removeAll,
}

export default StorageService
