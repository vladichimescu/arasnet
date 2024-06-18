import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import axios from "axios"
import React from "react"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const dateFormatter = ({ value }) =>
  // TODO: set LOCALE format based on i18n
  value
    ? new Intl.DateTimeFormat("ro-RO", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(value))
    : value

const pageSize = 20

const defaultColDef = {
  flex: 1,
}

const columnDefs = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "createdAt",
    headerName: "Creat",
    valueFormatter: dateFormatter,
  },
  {
    field: "location",
    headerName: "Locatie",
  },
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
    field: "date",
    headerName: "Programare",
    valueFormatter: dateFormatter,
  },
  {
    field: "status",
    headerName: "Status",
  },
]

const dataSource = {
  getRows: (params) => {
    const {
      startRow,
      endRow,
      successCallback,
      failCallback,
      filterModel: { phone: { filter: phoneNumber } = {} },
      sortModel: [{ colId = "", sort = "" } = {}],
    } = params

    axios
      .get("consultations", {
        params: {
          _start: startRow,
          _end: endRow,
          _sort: colId,
          _order: sort,
          phone_like: phoneNumber,
        },
      })
      .then(
        (data) => {
          if (data.length === pageSize) {
            successCallback(data)
          } else if (data.length === 0) {
            successCallback(data, startRow)
          } else {
            successCallback(data, startRow + data.length)
          }
        },
        () => {
          failCallback()
        }
      )
  },
}

function Consultations() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <AgGridReact
        className="ag-theme-quartz"
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowModelType="infinite"
        datasource={dataSource}
        cacheBlockSize={pageSize}
        rowBuffer={0}
        maxConcurrentDatasourceRequests={1}
      />
    </div>
  )
}

export default Consultations
