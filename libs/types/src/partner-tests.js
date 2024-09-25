import { i18n } from "@arasnet/i18n"

const configured = (
  process.env.PARTNER_TESTS || process.env.REACT_APP_PARTNER_TESTS
)?.split(",")

const data = {
  "82a555ed-ce64-4981-8a1e-07ad6d53f8cf": {
    label: i18n.t("entity.partner.test.hiv"),
  },
  "45a644ba-3a39-4b7d-b842-db1a2a4e480c": {
    label: i18n.t("entity.partner.test.hepatitisB"),
  },
  "64e4b0c1-fb1b-40b8-8213-7e24acba7575": {
    label: i18n.t("entity.partner.test.hepatitisC"),
  },
  "b06560a7-79b9-44a7-b9f0-cfec87e79606": {
    label: i18n.t("entity.partner.test.sifilis"),
  },
}

const partnerTests = configured
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

export default partnerTests
