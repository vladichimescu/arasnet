const eventRegistry = {}

function subscribe(id, handler) {
  const eventId = crypto.randomUUID()

  eventRegistry[eventId] = {
    type: id,
    handler,
  }

  return eventId
}

function unsubscribe(eventId) {
  delete eventRegistry[eventId]
}

function publish(id, payload) {
  Object.values(eventRegistry).forEach(({ type, handler }) =>
    type === id ? handler(payload) : null
  )
}

const EventService = {
  subscribe,
  unsubscribe,
  publish,
}

export default EventService
