import EventService from "./event-service"

const actionRegistry = {}

function create(id, handler, label) {
  const actionId = crypto.randomUUID()

  actionRegistry[actionId] = {
    type: id,
    handler,
    label,
  }

  EventService.publish("actions")

  return actionId
}

function remove(actionId) {
  delete actionRegistry[actionId]

  EventService.publish("actions")
}

const ActionService = {
  get actions() {
    return Object.values(actionRegistry)
  },
  create,
  remove,
}

export default ActionService
