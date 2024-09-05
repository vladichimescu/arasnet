import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.PREP_STATUSES || process.env.REACT_APP_PREP_STATUSES
)?.split(",")

const data = {
  "503e61f7-5c33-492b-9713-747b488db888": {
    label: i18n.t("entity.prep.status.created"),
  },
  "8678c3bc-70d5-48f8-a885-d2c6a6e17715": {
    label: i18n.t("entity.prep.status.pending"),
  },
  "bd262f11-a0e1-40ff-af7a-4d4457d3e728": {
    label: i18n.t("entity.prep.status.confirmed"),
  },
  "27f8712e-983e-405d-a107-53e23a03636f": {
    label: i18n.t("entity.prep.status.canceled"),
  },
  "17eeec48-d9e7-4580-9816-6526a8e33c66": {
    label: i18n.t("entity.prep.status.rescheduled"),
  },
}

const prepStatuses = configured
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

export default prepStatuses
