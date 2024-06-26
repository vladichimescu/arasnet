import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz-no-font.css"
import React, { useRef } from "react"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const pageSize = 20

function DataGrid({
  columnDefs,
  defaultColDef = {
    flex: 1,
    singleClickEdit: true,
    filterParams: {
      debounceMs: 500,
      maxNumConditions: 1,
    },
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
        flex: 1,
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
        onBodyScrollEnd={() => ref.current.api.autoSizeAllColumns()}
      />
    </div>
  )
}

export default DataGrid
export { valueFormatterDate }

//#region
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
      filterModel,
      sortModel: [{ colId: _sort = "", sort: _order = "" } = {}],
    } = {}) => {
      const filters = Object.entries(filterModel).reduce(
        (
          acc,
          [
            key,
            {
              filterType,
              type: operand,
              filter: filterValue,
              dateFrom,
              dateTo,
            },
          ]
        ) => {
          const filter = {
            text: {
              contains: {
                [`${key}_like`]: filterValue,
              },
            },
            number: {
              contains: {
                [`${key}_like`]: filterValue,
              },
            },
            date: {
              greaterThan: {
                [`${key}_gte`]: formatIncludesDate({ gte: dateFrom }),
              },
              lessThan: {
                [`${key}_lte`]: formatIncludesDate({ lte: dateTo }),
              },
              inRange: {
                [`${key}_gte`]: formatIncludesDate({ gte: dateFrom }),
                [`${key}_lte`]: formatIncludesDate({ lte: dateTo }),
              },
            },
          }[filterType][operand]

          return {
            ...acc,
            ...filter,
          }
        },
        {}
      )

      if (_start === 0) {
        ref.current.api.showLoadingOverlay()
      }

      datasourceApi({
        _start,
        _end,
        _sort,
        _order,
        ...filters,
      }).then(
        (data) => {
          successCallback(
            data,
            data.length !== pageSize ? _start + data.length : null
          )

          if (_start === 0 && data.length) {
            setTimeout(() => ref.current.api.autoSizeAllColumns(), 0)
          }

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

function formatIncludesDate({ gte, lte }) {
  if (gte) {
    return new Date(gte).toISOString()
  }

  if (lte) {
    const date = new Date(lte)
    date.setDate(date.getDate() + 1)

    return date.toISOString()
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
//#endregion
