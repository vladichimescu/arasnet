import React, { useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { i18n } from "@arasnet/i18n"

import ActionService from "../services/action-service"
import EventService from "../services/event-service"

import { useAuth } from "./auth-provider"

const isMobile = navigator.maxTouchPoints > 0

function NavBar() {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const ref = useRef()

  const { isLogged, canReadTesting, canReadEmployees } = useAuth()

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

          {canReadTesting ? (
            <option value="/testing">{i18n.t("page.testing.title")}</option>
          ) : null}

          {canReadEmployees ? (
            <option value="/employees">{i18n.t("page.employees.title")}</option>
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
            <option value="/logout">{i18n.t("generic.action.logout")}</option>
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

      {canReadTesting ? (
        <Link to="testing" className="button button-small">
          {i18n.t("page.testing.title")}
        </Link>
      ) : null}

      {canReadEmployees ? (
        <Link to="employees" className="button button-small">
          {i18n.t("page.employees.title")}
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
            {i18n.t("generic.action.logout")}
          </Link>
        ) : null}
      </div>
    </nav>
  )
}

export default NavBar
