import locations from "./locations.js"

const configured = (
  process.env.TESTING_LOCATIONS || process.env.REACT_APP_TESTING_LOCATIONS
)?.split(",")

const data = Object.entries(locations).reduce(
  (acc, [id, location]) =>
    location.services.includes("testing")
      ? {
          ...acc,
          [id]: location,
        }
      : acc,
  {}
)

const testingLocations = configured
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

export default testingLocations
