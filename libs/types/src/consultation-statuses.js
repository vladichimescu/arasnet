import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.ARASNET_CONSULTATION_STATUSES ||
  process.env.REACT_APP_CONSULTATION_STATUSES
)?.split(",")

const data = {
  "acffc089-0508-4c3f-945b-afd74376df92": {
    label: i18n.t("entity.consultation.status.created"),
  },
  "525dae76-6b6b-4dc4-b363-c1bf0f00e210": {
    label: i18n.t("entity.consultation.status.pending"),
  },
  "994f4f90-28c3-47a8-8bce-316a3914de14": {
    label: i18n.t("entity.consultation.status.confirmed"),
  },
  "d4ab114a-6cf5-4a75-8fc8-ee98d6de88f0": {
    label: i18n.t("entity.consultation.status.canceled"),
  },
  "fa433f77-e1a3-419b-842e-5e053b23d647": {
    label: i18n.t("entity.consultation.status.success"),
  },
  "0e08870a-e835-4861-ba72-74253adde5fb": {
    label: i18n.t("entity.consultation.status.failed"),
  },
}

const consultationStatuses = configured
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

export default consultationStatuses
