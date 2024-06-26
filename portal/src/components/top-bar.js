import React from "react"
import { Link } from "react-router-dom"

import { useActions } from "./actions-provider"
import { useAuth } from "./auth-provider"

const TopBar = () => {
  const { isLogged } = useAuth()
  const { actions } = useActions()

  return (
    <nav className="top-bar">
      <div className="top-bar-section">
        <Link to="consultations">
          <button>Consultations</button>
        </Link>

        <Link to="employees">
          <button>Employees</button>
        </Link>
      </div>

      <div className="top-bar-section">
        {actions.map(({ action, handler }) => (
          <button key={action} onClick={handler}>
            {action}
          </button>
        ))}

        {isLogged ? (
          <Link to="logout">
            <button>Logout</button>
          </Link>
        ) : (
          <Link to="login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default TopBar
