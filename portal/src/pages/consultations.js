import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
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

      {canCreateConsultations ? <CreateConsultation /> : null}
    </Fragment>
  )
}

export default Consultations

//#region
function ConfirmationButtons({ data }) {
  if (!data) {
    return null
  }

  const message = `Salutare,\nTe rugam sa confirmi programarea pentru testarea de ${valueFormatterDate({ value: data.date })}.\nCheckpoint ARAS Bucuresti (Bd. Eroii Sanitari, nr. 49).`

  return (
    <Fragment>
      <a
        className="button button-clear"
        style={{
          marginRight: "16px",
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
        href={`https://wa.me/${data.phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        <i className="fa-brands fa-whatsapp" />
        WhatsApp
      </a>

      <a
        className="button button-clear"
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
        }}
        href={`tel:${data.phone}`}
        target="_blank"
        rel="noreferrer"
      >
        <i className="fa-solid fa-phone" />
        Call
      </a>
    </Fragment>
  )
}
//#endregion
