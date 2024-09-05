import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.PREP_CATEGORIES || process.env.REACT_APP_PREP_CATEGORIES
)?.split(",")

const data = {
  "819fe082-df73-4a7c-a137-566466eab72f": {
    label: i18n.t("entity.prep.category.enrollment"),
  },
  "15c16269-4722-4bb8-a5e0-4dc37e290266": {
    label: i18n.t("entity.prep.category.pickUp"),
  },
  "1c17a8b7-ef02-4dff-877c-78e4d17a981f": {
    label: i18n.t("entity.prep.category.onDemand"),
  },
  "1ff9a9a9-2e3a-48db-ba14-46c900439c53": {
    label: i18n.t("entity.prep.category.2months"),
  },
  "9eaf063a-9b92-437d-80a2-346c20ec7653": {
    label: i18n.t("entity.prep.category.3months"),
  },
  "bf34d40c-f5d2-4475-abbf-f3fa2af65f6e": {
    label: i18n.t("entity.prep.category.vaccination"),
  },
}

const prepCategories = configured
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

export default prepCategories
