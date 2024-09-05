import locations from "./locations.js"

const configured = (
  process.env.PREP_LOCATIONS || process.env.REACT_APP_PREP_LOCATIONS
)?.split(",")

const data = Object.entries(locations).reduce(
  (acc, [id, location]) =>
    location.services.includes("prep")
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
