import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment } from "react"

import { i18n } from "@arasnet/i18n"
import {
  partnerAccounts,
  partnerStatuses,
  partnerTests,
  testingLocations,
} from "@arasnet/types"

import PartnerApi from "../apis/partner-api"
import { useAuth } from "../components/auth-provider"
import CreatePartner from "../components/create-partner"
import DataGrid, {
  DropdownColumnFilter,
  boolFormatter,
  dateFormatter,
  locationFormatter,
  onCellValueChanged,
} from "../components/data-grid"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const columnDefs = [
  {
    field: "test",
    headerName: i18n.t("entity.field.test"),
    valueFormatter: testFormatter,
    filter: TestColumnFilter,
  },
  {
    field: "location",
    headerName: i18n.t("entity.field.location"),
    valueFormatter: locationFormatter,
    filter: LocationColumnFilter,
  },
  {
    field: "confirmation",
    headerName: i18n.t("entity.field.confirmation"),
    valueFormatter: boolFormatter,
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
        values: Object.keys(partnerStatuses),
      },
    }),
    cellClass: "ag-cell-editable",
    onCellValueChanged,
  },
  {
    field: "contacts",
    headerName: i18n.t("entity.field.contacts"),
    valueFormatter: contactsFormatter,
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

function Partner() {
  const { canCreateTesting, canUpdateTesting } = useAuth()

  const columnDefsPermitted = canUpdateTesting
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
      <DataGrid columnDefs={columnDefsPermitted} context={PartnerApi} />

      {canCreateTesting ? <CreatePartner /> : null}
    </Fragment>
  )
}

export default Partner

//#region
function testFormatter({ value }) {
  return value ? partnerTests[value].label : value
}

function statusFormatter({ value }) {
  return value ? partnerStatuses[value].label : value
}

function contactsFormatter({ value }) {
  return value
    ? value
        .map(
          ([platform, account]) =>
            `${partnerAccounts[platform]?.label || platform} ${account}`
        )
        .join(", ")
    : value
}

function TestColumnFilter(props) {
  return <DropdownColumnFilter options={partnerTests} {...props} />
}

function StatusColumnFilter(props) {
  return <DropdownColumnFilter options={partnerStatuses} {...props} />
}

function LocationColumnFilter(props) {
  return <DropdownColumnFilter options={testingLocations} {...props} />
}
//#endregion
