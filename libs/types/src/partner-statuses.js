import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.PARTNER_STATUSES || process.env.REACT_APP_PARTNER_STATUSES
)?.split(",")

const data = {
  "b65becc6-6b10-44a7-866e-4dfa3c686f8e": {
    label: i18n.t("entity.partner.status.created"),
  },
  "3dcc76a3-1238-4629-ba0a-7157e3a25265": {
    label: i18n.t("entity.partner.status.pending"),
  },
  "d3618f0d-0f2a-4382-b265-30b337accaa4": {
    label: i18n.t("entity.partner.status.verified"),
  },
}

const partnerStatuses = configured
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

export default partnerStatuses
