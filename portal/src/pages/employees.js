import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment, useState } from "react"

import EmployeesApi from "../apis/employees-api"
import { useAuth } from "../components/auth-provider"
import CreateEmployee from "../components/create-employee"
import DataGrid, { dateFormatter } from "../components/data-grid"
import UpdatePermissions from "../components/update-permissions"

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
    headerName: "Name",
    valueGetter: ({ data: { first, last } = {} }) => `${first} ${last}`,
  },
  {
    field: "email",
    headerName: "Email",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "permissions",
    cellRenderer: PermissionsButton,
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: dateFormatter,
    sortable: true,
  },
  {
    field: "createdBy",
    headerName: "Created by",
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
  const [isOpened, setIsOpened] = useState(false)

  if (!data) {
    return null
  }

  return (
    <Fragment>
      <button
        type="button"
        className="button-outline button-small"
        onClick={() => setIsOpened(true)}
      >
        Permissions
      </button>

      {isOpened ? (
        <UpdatePermissions
          open={isOpened}
          onClose={() => setIsOpened(false)}
          employee={data}
        />
      ) : null}
    </Fragment>
  )
}
//#endregion
