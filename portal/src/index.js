import NProgress from "nprogress"
import React, { Fragment, Suspense, lazy, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import AuthProvider from "./components/auth-provider"
import ErrorBoundary from "./components/error-boundary"
import I18nProvider from "./components/i18n-provider"
import Loading from "./components/loading"
import NavBar from "./components/nav-bar"
import "./index.scss"
import Home from "./pages/home"
import Login from "./pages/login"
import Logout from "./pages/logout"
import NotFound from "./pages/not-found"
import Restart from "./pages/restart"
import EventService from "./services/event-service"

const Testing = lazy(() => import("./pages/testing"))
const Employees = lazy(() => import("./pages/employees"))
const Prep = lazy(() => import("./pages/prep"))
// const Dashboard = lazy(() => import("./pages/dashboard"))
// const Landing = lazy(() => import("./pages/landing"))

NProgress.configure({ showSpinner: false })

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // {
      //   path: "landing",
      //   element: <Landing />,
      // },
      // {
      //   path: "dashboard",
      //   element: <Dashboard />,
      // },
      {
        path: "testing",
        element: <Testing />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "prep",
        element: <Prep />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "restart",
        element: <Restart />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <I18nProvider>
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ErrorBoundary>
    </I18nProvider>
  </React.StrictMode>
)

//#region
function Layout() {
  const [isToastGlobal, setIsToastGlobal] = useState(true)

  useEffect(() => {
    const eventId = EventService.subscribe("toast-global", (payload) => {
      setIsToastGlobal(payload)
    })

    return () => {
      EventService.unsubscribe(eventId)
    }
  }, [])

  return (
    <Fragment>
      {isToastGlobal ? (
        <ToastContainer autoClose={3500} closeOnClick position="top-center" />
      ) : null}

      <NavBar />

      <Suspense fallback={<Loading />}>
        <main>
          <Outlet />
        </main>
      </Suspense>
    </Fragment>
  )
}
//#endregion
