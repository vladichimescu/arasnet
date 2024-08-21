import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment, useState } from "react"

import { i18n } from "@arasnet/i18n"

import EmployeesApi from "../apis/employees-api"
import { useAuth } from "../components/auth-provider"
import CreateEmployee from "../components/create-employee"
import DataGrid, { dateFormatter } from "../components/data-grid"
import UpdatePermissions from "../components/update-permissions"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const columnDefs = [
  {
    field: "phone",
    headerName: i18n.t("entity.field.phone"),
    filter: "agNumberColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    headerName: i18n.t("entity.field.name"),
    valueGetter: ({ data: { firstName, lastName } = {} }) =>
      `${firstName || ""} ${lastName || ""} `.trim(),
  },
  {
    field: "email",
    headerName: i18n.t("entity.field.email"),
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "permissions",
    headerName: i18n.t("entity.field.permissions"),
    cellRenderer: PermissionsButton,
  },
  {
    field: "createdAt",
    headerName: i18n.t("entity.field.createdAt"),
    valueFormatter: dateFormatter,
    sortable: true,
  },
  {
    field: "createdBy",
    headerName: i18n.t("entity.field.createdBy"),
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
]

function Employees() {
  const { canCreateEmployees } = useAuth()

  return (
    <Fragment>
      <DataGrid columnDefs={columnDefs} context={EmployeesApi} />

      {canCreateEmployees ? <CreateEmployee /> : null}
    </Fragment>
  )
}

export default Employees

//#region
function PermissionsButton({ data }) {
  const { user } = useAuth()

  const [isOpened, setIsOpened] = useState(false)

  if (!data || data.createdBy === "SYSTEM" || data.email === user.email) {
    return null
  }

  return (
    <Fragment>
      <button
        type="button"
        className="button-outline button-small"
        onClick={() => {
          setIsOpened(true)
        }}
      >
        {i18n.t("page.employees.dataGrid.action.permissions")}
      </button>

      {isOpened ? (
        <UpdatePermissions
          open={isOpened}
          onClose={() => {
            setIsOpened(false)
          }}
          employee={data}
        />
      ) : null}
    </Fragment>
  )
}
//#endregion
