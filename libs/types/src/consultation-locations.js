import locations from "./locations.js"

const configured = (
  process.env.CONSULTATION_LOCATIONS ||
  process.env.REACT_APP_CONSULTATION_LOCATIONS
)?.split(",")

const data = Object.entries(locations).reduce(
  (acc, [id, location]) =>
    location.services.includes("consultation")
      ? {
          ...acc,
          [id]: location,
        }
      : acc,
  {}
)

const consultationLocations = configured
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

export default consultationLocations
