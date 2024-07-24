const events = {
  CREATED: "CREATED",
  READ: "READ",
  UPDATED: "UPDATED",
  REMOVED: "REMOVED",
}

const eventRegistry = {}

function subscribeEvent(id, handler) {
  const eventId = crypto.randomUUID()

  eventRegistry[eventId] = {
    type: id,
    handler,
  }

  return eventId
}

function unsubscribeEvent(eventId) {
  delete eventRegistry[eventId]
}

function publishEvent(id) {
  Object.values(eventRegistry).forEach(({ type, handler }) =>
    type === id ? handler() : null
  )
}

const EventService = {
  get events() {
    return events
  },
  subscribeEvent,
  unsubscribeEvent,
  publishEvent,
}

export default EventService
