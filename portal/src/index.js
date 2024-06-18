import axios from "axios"
import React, { Fragment, Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import AuthProvider from "./components/auth-provider"
import ErrorBoundary from "./components/error-boundary"
import Loading from "./components/loading"
import "./index.css"
import NotFound from "./pages/not-found"
import AuthService from "./services/auth-service"

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Consultations = lazy(() => import("./pages/consultations"))
const Dashboard = lazy(() => import("./pages/dashboard"))
const Landing = lazy(() => import("./pages/landing"))
const Login = lazy(() => import("./pages/login"))
const Logout = lazy(() => import("./pages/logout"))
const Home = lazy(() => import("./pages/home"))

axios.interceptors.request.use((config) => {
  config.baseURL = SERVER_URL
  config.headers.authorization = AuthService.getAuthHeader()

  return config
})

axios.interceptors.response.use(
  ({ data }) => data,
  ({ response: { status, data } }) => {
    // TODO: handle web errors
    if (status === 401) {
      // Handle unauthorized access
    } else if (status === 400) {
      // Handle business validation
    } else if (status === 404) {
      // Handle not found errors
    } else {
      // Handle other errors
    }

    throw data
  }
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Fragment>
      <Route path="" element={<Home />} />

      <Route path="landing" element={<Landing />} />

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="consultations" element={<Consultations />} />

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
          <RouterProvider router={router} />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
)
