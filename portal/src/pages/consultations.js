import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment } from "react"

import { consultationStatuses } from "@arasnet/types"

import ConsultationsApi from "../apis/consultations-api"
import { useAuth } from "../components/auth-provider"
import CreateConsultation from "../components/create-consultation"
import DataGrid, {
  DropdownColumnFilter,
  dateFormatter,
  locationFormatter,
  onCellValueChanged,
  statusFormatter,
} from "../components/data-grid"

ModuleRegistry.registerModules([InfiniteRowModelModule])

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
    valueFormatter: dateFormatter,
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["greaterThan", "lessThan", "inRange"],
    },
    sortable: true,
  },
  {
    field: "status",
    headerName: "Status",
    valueFormatter: statusFormatter,
    filter: StatusColumnFilter,
    editable: true,
    cellEditorSelector: () => ({
      component: "agSelectCellEditor",
      params: {
        values: Object.keys(consultationStatuses),
      },
    }),
    cellClass: "ag-cell-editable",
    onCellValueChanged,
  },
  {
    field: "confirmation",
    cellRenderer: ConfirmationButtons,
  },
  {
    // TODO: filter select
    field: "location",
    headerName: "Location",
    valueFormatter: locationFormatter,
  },
  {
    field: "createdAt",
    headerName: "Created at",
    valueFormatter: dateFormatter,
    sortable: true,
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["greaterThan", "lessThan", "inRange"],
    },
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

  const message = `Salutare,\nTe rugam sa confirmi programarea pentru testarea de ${dateFormatter({ value: data.date })}.\nCheckpoint ARAS Bucuresti (Bd. Eroii Sanitari, nr. 49).`

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

function StatusColumnFilter(props) {
  return <DropdownColumnFilter options={consultationStatuses} {...props} />
}
//#endregion
