import React from "react"
import { Link } from "react-router-dom"

import { useActions } from "../actions-provider"
import { useAuth } from "../auth-provider"

import classes from "./top-bar.module.css"

const TopBar = () => {
  const { isLogged, canReadConsultations, canReadEmployees } = useAuth()
  const { actions } = useActions()

  return (
    <nav className={classes.nav}>
      <div className={classes.section}>
        {isLogged ? (
          <Link to="dashboard">
            <button>Dashboard</button>
          </Link>
        ) : (
          <Link to="landing">
            <button>Landing</button>
          </Link>
        )}

        {canReadConsultations ? (
          <Link to="consultations">
            <button>Consultations</button>
          </Link>
        ) : null}

        {canReadEmployees ? (
          <Link to="employees">
            <button>Employees</button>
          </Link>
        ) : null}
      </div>

      <div className={classes.section}>
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
