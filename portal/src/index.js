import NProgress from "nprogress"
import React, { Fragment, Suspense, lazy, useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import ActionsProvider, { useActions } from "./components/actions-provider"
import AuthProvider from "./components/auth-provider"
import ErrorBoundary from "./components/error-boundary"
import Loading from "./components/loading"
import TopBar from "./components/top-bar"
import "./index.scss"
import NotFound from "./pages/not-found"

const Consultations = lazy(() => import("./pages/consultations"))
const Employees = lazy(() => import("./pages/employees"))
// const Dashboard = lazy(() => import("./pages/dashboard"))
// const Landing = lazy(() => import("./pages/landing"))
const Login = lazy(() => import("./pages/login"))
const Logout = lazy(() => import("./pages/logout"))
const Home = lazy(() => import("./pages/home"))

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
        path: "consultations",
        element: <Consultations />,
      },
      {
        path: "employees",
        element: <Employees />,
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ActionsProvider>
          <Suspense fallback={<Loading fullPage />}>
            <RouterProvider router={router} />
          </Suspense>
        </ActionsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

//#region
function Layout() {
  const { addAction, removeAction } = useActions()

  const [isToastGlobal, setIsToastGlobal] = useState(true)

  useEffect(() => {
    const actionId = addAction({
      handler: setIsToastGlobal,
      type: "toast-global",
    })

    return () => {
      removeAction(actionId)
    }
  }, [addAction, removeAction])

  return (
    <Fragment>
      {isToastGlobal ? (
        <ToastContainer autoClose={3500} closeOnClick position="top-center" />
      ) : null}

      <TopBar />

      <main>
        <Outlet />
      </main>
    </Fragment>
  )
}
//#endregion
