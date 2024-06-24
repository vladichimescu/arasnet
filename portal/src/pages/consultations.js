import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React from "react"
import { toast } from "react-toastify"

import ConsultationsApi from "../apis/consultations-api"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const consultationStatuses =
  process.env.REACT_APP_CONSULTATION_STATUSES.split(",")

const ConfirmationButtons = ({ data: { phone } = {} }) => (
  <div>
    <button
      onClick={() =>
        window.open(
          `https://wa.me/${phone}?text=${encodeURIComponent("te rugam sa confirmi")}`
        )
      }
    >
      WhatsApp
    </button>
    <button onClick={() => window.open(`tel:${phone}`)}>Phone</button>
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
    field: "date",
    headerName: "Programare",
    valueFormatter: dateFormatter,
  },
  {
    field: "status",
    headerName: "Status",
    editable: true,
    cellEditorSelector:
      consultationStatuses.length > 1
        ? () => ({
            component: "agSelectCellEditor",
            params: { values: consultationStatuses },
          })
        : null,
    onCellValueChanged: async ({ api: gridApi, data, oldValue }) => {
      try {
        await ConsultationsApi.update(data)
        toast("Status updated")
      } catch (err) {
        gridApi.getRowNode(`${data.id}`).updateData({
          ...data,
          status: oldValue,
        })
        toast(`Status could not be updated\nreason: ${err.message}`)
      }
    },
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
    field: "confirmation",
    cellRenderer: ConfirmationButtons,
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

export default Consultations
