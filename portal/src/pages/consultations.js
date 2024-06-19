import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React from "react"

import ConsultationsApi from "../apis/consultations-api"

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
      startRow: _start,
      endRow: _end,
      successCallback,
      failCallback,
      filterModel: { phone: { filter: phone_like } = {} },
      sortModel: [{ colId: _sort = "", sort: _order = "" } = {}],
    } = params

    ConsultationsApi.read({
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
