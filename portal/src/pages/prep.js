import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment } from "react"

import { i18n } from "@arasnet/i18n"
import { prepCategories, prepLocations, prepStatuses } from "@arasnet/types"

import PrepApi from "../apis/prep-api"
import { useAuth } from "../components/auth-provider"
import CreatePrep from "../components/create-prep"
import DataGrid, {
  DropdownColumnFilter,
  dateFormatter,
  locationFormatter,
  onCellValueChanged,
} from "../components/data-grid"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const columnDefs = [
  {
    field: "location",
    headerName: i18n.t("entity.field.location"),
    valueFormatter: locationFormatter,
    filter: Object.keys(prepLocations).length < 2 ? null : LocationColumnFilter,
  },
  {
    field: "date",
    headerName: i18n.t("entity.field.date"),
    valueFormatter: dateFormatter,
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["greaterThan", "lessThan", "inRange"],
    },
    sortable: true,
  },
  {
    field: "name",
    headerName: i18n.t("entity.field.name"),
  },
  {
    field: "phone",
    headerName: i18n.t("entity.field.phone"),
    filter: "agNumberColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "category",
    headerName: i18n.t("entity.field.category"),
    valueFormatter: categoryFormatter,
  },
  {
    field: "status",
    headerName: i18n.t("entity.field.status"),
    valueFormatter: statusFormatter,
    filter: StatusColumnFilter,
    editable: true,
    cellEditorSelector: () => ({
      component: "agSelectCellEditor",
      params: {
        values: Object.keys(prepStatuses),
      },
    }),
    cellClass: "ag-cell-editable",
    onCellValueChanged,
  },
  {
    field: "createdAt",
    headerName: i18n.t("entity.field.createdAt"),
    valueFormatter: dateFormatter,
    sortable: true,
    filter: "agDateColumnFilter",
    filterParams: {
      filterOptions: ["greaterThan", "lessThan", "inRange"],
    },
  },
  {
    field: "createdBy",
    headerName: i18n.t("entity.field.createdBy"),
  },
]

function Prep() {
  const { canCreatePrep, canUpdatePrep } = useAuth()

  const columnDefsPermitted = canUpdatePrep
    ? columnDefs
    : columnDefs.map((columnDef) =>
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
      <DataGrid columnDefs={columnDefsPermitted} context={PrepApi} />

      {canCreatePrep ? <CreatePrep /> : null}
    </Fragment>
  )
}

export default Prep

//#region
function categoryFormatter({ value }) {
  if (value) {
    if (!prepCategories[value]?.label) {
      console.log(value)
    }
  }
  return value
    ? prepCategories[value]?.label || 'CEVA MAI LUNG DE BAZUT"'
    : value
}

function statusFormatter({ value }) {
  return value ? prepStatuses[value].label : value
}

function StatusColumnFilter(props) {
  return <DropdownColumnFilter options={prepStatuses} {...props} />
}

function LocationColumnFilter(props) {
  return <DropdownColumnFilter options={prepLocations} {...props} />
}
//#endregion
