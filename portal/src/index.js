import React, { Fragment, Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AuthProvider from "./components/auth-provider"
import ErrorBoundary from "./components/error-boundary"
import Loading from "./components/loading"
import "./index.css"
import NotFound from "./pages/not-found"

const Consultations = lazy(() => import("./pages/consultations"))
const Employees = lazy(() => import("./pages/employees"))
// const Dashboard = lazy(() => import("./pages/dashboard"))
// const Landing = lazy(() => import("./pages/landing"))
const Login = lazy(() => import("./pages/login"))
const Logout = lazy(() => import("./pages/logout"))
const Home = lazy(() => import("./pages/home"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route index element={<Home />} />

      {/* <Route path="landing" element={<Landing />} /> */}

      {/* <Route path="dashboard" element={<Dashboard />} /> */}
      <Route path="consultations" element={<Consultations />} />
      <Route path="employees" element={<Employees />} />

      <Route path="logout" element={<Logout />} />
      <Route path="login" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Fragment>
  )
)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <AuthProvider>
          <ToastContainer
            autoClose={3500}
            closeOnClick
            position="top-center"
            theme="colored"
          />
          <RouterProvider router={router} />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)
