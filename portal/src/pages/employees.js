import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import React, { Fragment, useState } from "react"

import EmployeesApi from "../apis/employees-api"
import { useAuth } from "../components/auth-provider"
import CreateEmployee from "../components/create-employee"
import DataGrid, { valueFormatterDate } from "../components/data-grid"
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
    field: "first",
    headerName: "First",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
  },
  {
    field: "last",
    headerName: "Last",
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
    },
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
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: valueFormatterDate,
  },
  {
    field: "createdBy",
    headerName: "Created by",
  },
]

function Employees() {
  const { canCreateEmployees } = useAuth()

  return (
    <Fragment>
      <DataGrid columnDefs={columnDefs} context={EmployeesApi} />

      {canCreateEmployees ? (
        <CreateEmployee
          onSuccess={() => EmployeesApi.gridApi.purgeInfiniteCache()}
        />
      ) : null}
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
      <button onClick={() => setIsOpened(true)}>Permissions</button>

      {isOpened ? (
        <UpdatePermissions
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          employee={data}
        />
      ) : null}
    </Fragment>
  )
}
//#endregion
