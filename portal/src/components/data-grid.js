import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz-no-font.css"
// import "@ag-grid-community/styles/ag-theme-quartz.css"
import React, { useRef } from "react"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const pageSize = 20

function LoadingCell({ value, api: gridApi }) {
  if (value) {
    return value
  }

  if (gridApi.getCacheBlockState()[0].pageStatus === "loading") {
    return null
  }

  return "Loading..."
}

function datasource(datasourceApi, ref) {
  return {
    getRows: ({
      startRow: _start,
      endRow: _end,
      successCallback,
      failCallback,
      filterModel: { phone: { filter: phone_like } = {} },
      sortModel: [{ colId: _sort = "", sort: _order = "" } = {}],
    } = {}) => {
      if (_start === 0) {
        ref.current.api.showLoadingOverlay()
      }

      datasourceApi({
        _start,
        _end,
        _sort,
        _order,
        phone_like,
      }).then(
        (data) => {
          successCallback(
            data,
            data.length !== pageSize ? _start + data.length : null
          )

          setTimeout(() => ref.current.api.autoSizeAllColumns(), 0)

          ref.current.api.hideOverlay()
        },
        () => {
          failCallback()

          ref.current.api.hideOverlay()
        }
      )
    },
  }
}

function valueFormatterDate({ value }) {
  // TODO: set LOCALE format based on i18n
  return value
    ? new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(value))
    : value
}

function DataGrid({
  columnDefs,
  defaultColDef = {
    flex: 1,
    singleClickEdit: true,
  },
  getRowId = ({ data: { id } = {} }) => id,
  datasourceApi,
}) {
  const ref = useRef()

  columnDefs[0].cellRenderer = LoadingCell

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <AgGridReact
        ref={ref}
        className="ag-theme-quartz-auto-dark"
        suppressMenuHide
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowModelType="infinite"
        datasource={datasource(datasourceApi, ref)}
        cacheBlockSize={pageSize}
        rowBuffer={0}
        maxConcurrentDatasourceRequests={1}
      />
    </div>
  )
}

export default DataGrid
export { valueFormatterDate }
