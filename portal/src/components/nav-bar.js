import React, { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import ActionService from "../services/action-service"
import EventService from "../services/event-service"

import { useAuth } from "./auth-provider"

const isMobile = navigator.maxTouchPoints > 0

function NavBar() {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const ref = useRef()

  const { isLogged, canReadConsultations, canReadEmployees } = useAuth()

  const [actions, setActions] = useState(ActionService.actions)

  useEffect(() => {
    EventService.subscribe("actions", (actions) => {
      setActions(actions.filter(({ type }) => type === "nav-bar"))
    })
  }, [])

  if (pathname === "/") {
    return null
  }

  if (isMobile) {
    const isMobileMenuEmpty = !ref.current || ref.current.length === 0

    return (
      <select
        ref={ref}
        className="button"
        style={{
          display: isMobileMenuEmpty ? "none" : null,
          borderRadius: 0,
        }}
        value={pathname}
        onChange={({ target: { value } }) =>
          value.startsWith("/") ? navigate(value) : actions[value].handler()
        }
      >
        <optgroup label="ARASnet admin">
          {/* {isLogged ? (
            <option value="/dashboard">Dashboard</option>
          ) : (
            <option value="/landing">Landing</option>
          )} */}

          {canReadConsultations ? (
            <option value="/consultations">Consultations</option>
          ) : null}

          {canReadEmployees ? (
            <option value="/employees">Employees</option>
          ) : null}
        </optgroup>

        {actions.length === 0 ? null : (
          <optgroup>
            {actions.map(({ label }, index) => (
              <option key={index} value={index}>
                {label}
              </option>
            ))}
          </optgroup>
        )}

        {isLogged ? (
          <optgroup>
            <option value="/logout">Logout</option>
          </optgroup>
        ) : null}
      </select>
    )
  }

  return (
    <nav
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "8px",
        marginLeft: "8px",
        marginRight: "8px",
      }}
    >
      {/* {isLogged ? (
        <Link to="dashboard" className="button button-small">
          Dashboard
        </Link>
      ) : (
        <Link to="landing" className="button button-small">
          Landing
        </Link>
      )} */}

      {canReadConsultations ? (
        <Link to="consultations" className="button button-small">
          Consultations
        </Link>
      ) : null}

      {canReadEmployees ? (
        <Link to="employees" className="button button-small">
          Employees
        </Link>
      ) : null}

      <div
        style={{
          display: "flex",
          marginLeft: "auto",
          gap: "8px",
        }}
      >
        {actions.map(({ label, handler }) => (
          <button key={label} onClick={handler} className="button-small">
            {label}
          </button>
        ))}

        {isLogged ? (
          <Link to="logout" className="button button-small">
            Logout
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

export default NavBar
