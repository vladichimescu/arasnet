import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React from "react"

import ConsultationsApi from "../apis/consultations-api"
import DataGrid, {
  onCellValueChanged,
  valueFormatterDate,
} from "../components/data-grid"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const consultationStatuses =
  process.env.REACT_APP_CONSULTATION_STATUSES.split(",")

const columnDefs = [
  {
    field: "phone",
    headerName: "Phone",
    filter: "agNumberColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "date",
    headerName: "Appointment",
    valueFormatter: valueFormatterDate,
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["greaterThan", "lessThan", "inRange"],
    },
  },
  {
    field: "status",
    headerName: "Status",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
    editable: true,
    cellEditorSelector:
      consultationStatuses.length > 1
        ? () => ({
            component: "agSelectCellEditor",
            params: { values: consultationStatuses },
          })
        : null,
    onCellValueChanged: onCellValueChanged(ConsultationsApi),
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: valueFormatterDate,
  },
  {
    field: "location",
    headerName: "Location",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "confirmation",
    cellRenderer: ConfirmationButtons,
  },
]

function Consultations() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <DataGrid columnDefs={columnDefs} datasourceApi={ConsultationsApi.read} />
    </div>
  )
}

export default Consultations

//#region
function ConfirmationButtons({ data: { phone } = {} }) {
  if (!phone) {
    return null
  }

  return (
    <div>
      <button
        style={{ marginRight: 15 }}
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
}
//#endregion
