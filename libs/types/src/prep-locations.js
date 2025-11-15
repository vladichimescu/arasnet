import locations from "./locations.js"
import services from "./services.js"

const configured = (
  process.env.PREP_LOCATIONS || process.env.REACT_APP_PREP_LOCATIONS
)?.split(",")

const data = Object.entries(locations).reduce(
  (acc, [id, location]) =>
    location.services.includes(services.PREP)
      ? {
          ...acc,
          [id]: location,
        }
      : acc,
  {}
)

const prepLocations = configured
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

export default prepLocations
