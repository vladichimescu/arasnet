import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React from "react"

import EmployeesApi from "../apis/employees-api"
import DataGrid, { valueFormatterDate } from "../components/data-grid"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const PermissionsButton = ({ api: gridApi, data: { email } = {} }) =>
  email ? (
    <div>
      <button onClick={() => window.alert(`Permissions ${email}`)}>
        Permissions
      </button>
    </div>
  ) : null

const columnDefs = [
  {
    field: "phone",
    headerName: "Phone",
    filter: "agNumberColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      maxNumConditions: 1,
      debounceMs: 500,
    },
  },
  {
    field: "first",
    headerName: "First",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      maxNumConditions: 1,
      debounceMs: 500,
    },
  },
  {
    field: "last",
    headerName: "Last",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      maxNumConditions: 1,
      debounceMs: 500,
    },
  },
  {
    field: "email",
    headerName: "Email",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      maxNumConditions: 1,
      debounceMs: 500,
    },
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: valueFormatterDate,
  },
  {
    field: "permissions",
    cellRenderer: PermissionsButton,
  },
]

function Employees() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <DataGrid columnDefs={columnDefs} datasourceApi={EmployeesApi.read} />
    </div>
  )
}

export default Employees
