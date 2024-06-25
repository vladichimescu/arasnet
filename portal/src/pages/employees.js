import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React from "react"
import { toast } from "react-toastify"

import EmployeesApi from "../apis/employees-api"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const PermissionsButton = ({ api: gridApi, data: { email } = {} }) => (
  <div>
    <button onClick={() => window.alert(`Permissions ${email}`)}>
      Permissions
    </button>
  </div>
)

const dateFormatter = ({ value }) =>
  // TODO: set LOCALE format based on i18n
  value
    ? new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(value))
    : value

const getRowId = ({ data: { id } = {} }) => id

const pageSize = 20

const defaultColDef = {
  flex: 1,
  singleClickEdit: true,
}

const columnDefs = [
  {
    field: "phone",
    headerName: "Telefon",
    filter: "agNumberColumnFilter",
    filterParams: {
      // TODO: change name of filter
      filterOptions: ["PHONE NUMBER"],
      maxNumConditions: 1,
      debounceMs: 500,
    },
  },
  {
    field: "first",
    headerName: "First",
  },
  {
    field: "last",
    headerName: "Last",
  },
  {
    field: "email",
    headerName: "Email",
  },
  {
    field: "createdAt",
    headerName: "Creat",
    valueFormatter: dateFormatter,
  },
  {
    field: "permissions",
    cellRenderer: PermissionsButton,
  },
]

const dataSource = {
  getRows: (params) => {
    const {
      startRow: _start,
      endRow: _end,
      successCallback,
      failCallback,
      filterModel: { phone: { filter: phone_like } = {} },
      sortModel: [{ colId: _sort = "", sort: _order = "" } = {}],
    } = params

    EmployeesApi.read({
      _start,
      _end,
      _sort,
      _order,
      phone_like,
    }).then(
      (data) =>
        successCallback(
          data,
          data.length !== pageSize ? _start + data.length : null
        ),
      failCallback
    )
  },
}

function Employees() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <AgGridReact
        className="ag-theme-quartz-auto-dark"
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowModelType="infinite"
        datasource={dataSource}
        cacheBlockSize={pageSize}
        rowBuffer={0}
        maxConcurrentDatasourceRequests={1}
      />
    </div>
  )
}

export default Employees
