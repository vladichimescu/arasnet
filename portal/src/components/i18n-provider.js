import React from "react"
import { I18nextProvider } from "react-i18next"

import { i18n } from "@arasnet/i18n"

function I18nProvider(props) {
  return <I18nextProvider i18n={i18n} {...props} />
}

export default I18nProvider
