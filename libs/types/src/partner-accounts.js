import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.PARTNER_ACCOUNTS || process.env.REACT_APP_PARTNER_ACCOUNTS
)?.split(",")

const data = {
  "4eb9e48c-2c80-48a7-bc8e-eb7fbd38fe26": {
    label: i18n.t("entity.partner.account.phone"),
  },
  "df6714bd-09c5-4a6b-b5d8-c212ef4a286c": {
    label: i18n.t("entity.partner.account.facebook"),
  },
  "efe7515a-d656-4c50-acec-9632a4233e08": {
    label: i18n.t("entity.partner.account.instagram"),
  },
  "45663837-a429-447b-b106-295b03e718ae": {
    label: i18n.t("entity.partner.account.snapchat"),
  },
  "f400f8ab-f397-454e-b90d-9b66d5dd7bde": {
    label: i18n.t("entity.partner.account.romeo"),
  },
}

const partnerAccounts = configured
  ? configured.reduce(
      (acc, id) =>
        data[id]
          ? {
              ...acc,
              [id]: data[id],
            }
          : acc,
      {}
    )
  : data

export default partnerAccounts
