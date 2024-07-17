import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

const Context = createContext()

function ActionsProvider(props) {
  const [actionRegistry, setActionRegistry] = useState({})

  const actions = useMemo(() => Object.values(actionRegistry), [actionRegistry])

  const addAction = useCallback(({ label, handler, type }) => {
    const actionId = crypto.randomUUID()

    setActionRegistry((state) => ({
      ...state,
      [actionId]: {
        label,
        handler,
        type,
      },
    }))

    return actionId
  }, [])

  const removeAction = useCallback((actionId) => {
    setActionRegistry((state) => {
      const newState = { ...state }

      delete newState[actionId]

      return newState
    })
  }, [])

  const clearActions = useCallback(() => {
    setActionRegistry({})
  }, [])

  return (
    <Context.Provider
      value={{
        actions,
        addAction,
        removeAction,
        clearActions,
      }}
      {...props}
    />
  )
}

export default ActionsProvider
export const useActions = (presetType) => {
  const context = useContext(Context)

  if (presetType) {
    return {
      ...context,
      actions: context.actions.filter(({ type }) => type === presetType),
    }
  }

  return context
}
