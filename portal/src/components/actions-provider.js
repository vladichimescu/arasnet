import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

const Context = createContext()

function ActionsProvider(props) {
  const [actionRegistry, setActionRegistry] = useState({})
  const [actions, setActions] = useState([])

  useEffect(() => {
    setActions(Object.values(actionRegistry))
  }, [actionRegistry])

  const addAction = useCallback(({ label, handler, type = "top-bar" }) => {
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
      delete state[actionId]

      return { ...state }
    })
  }, [])

  const clearActions = useCallback(() => {
    setActionRegistry((state) => {
      state.clear()
      return { ...state }
    })
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
export const useActions = () => useContext(Context)
