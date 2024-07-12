import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import React, { Fragment } from "react"

import ConsultationsApi from "../apis/consultations-api"
import { useAuth } from "../components/auth-provider"
import CreateConsultation from "../components/create-consultation"
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
    cellClass: consultationStatuses.length > 1 ? "ag-cell-editable" : null,
    onCellValueChanged,
  },
  {
    field: "confirmation",
    cellRenderer: ConfirmationButtons,
    sortable: false,
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
    field: "createdAt",
    headerName: "Created at",
    valueFormatter: valueFormatterDate,
  },
  {
    field: "createdBy",
    headerName: "Created by",
  },
]

function Consultations() {
  const { canCreateConsultations, canUpdateConsultations } = useAuth()

  const columnDefsPermitted = canUpdateConsultations
    ? columnDefs
    : columnDefs
        .filter(({ field }) => field !== "confirmation")
        .map((columnDef) =>
          columnDef.field !== "status"
            ? columnDef
            : {
                ...columnDef,
                editable: false,
                cellClass: null,
              }
        )

  return (
    <Fragment>
      <DataGrid columnDefs={columnDefsPermitted} context={ConsultationsApi} />

      {canCreateConsultations ? (
        <CreateConsultation
          onSuccess={() => ConsultationsApi.gridApi.purgeInfiniteCache()}
        />
      ) : null}
    </Fragment>
  )
}

export default Consultations

//#region
function ConfirmationButtons({ data }) {
  if (!data) {
    return null
  }

  return (
    <div>
      <button
        style={{ marginRight: 15 }}
        onClick={() =>
          window.open(
            `https://wa.me/${data.phone}?text=${encodeURIComponent("te rugam sa confirmi")}`
          )
        }
      >
        WhatsApp
      </button>
      <button onClick={() => window.open(`tel:${data.phone}`)}>Phone</button>
    </div>
  )
}
//#endregion
