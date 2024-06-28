import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz-no-font.css"
import React from "react"
import { toast } from "react-toastify"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const pageSize = 20

const defaultGridColDef = {
  flex: 1,
  singleClickEdit: true,
  filterParams: {
    debounceMs: 500,
    maxNumConditions: 1,
  },
}

const datasource = {
  getRows: ({
    startRow: _start,
    endRow: _end,
    successCallback,
    failCallback,
    filterModel,
    sortModel: [{ colId: _sort = "", sort: _order = "" } = {}],
    context,
  } = {}) => {
    const filters = mapFilters(filterModel)

    if (_start === 0) {
      context.api.showLoadingOverlay()
    }

    context
      .read({
        _start,
        _end,
        _sort,
        _order,
        ...filters,
      })
      .then(
        (data) => {
          successCallback(
            data,
            data.length !== pageSize ? _start + data.length : null
          )

          if (_start === 0 && data.length) {
            setTimeout(() => context.api.autoSizeAllColumns(), 0)
          }

          context.api.hideOverlay()
        },
        () => {
          failCallback()

          context.api.hideOverlay()
        }
      )
  },
}

function DataGrid({
  columnDefs,
  defaultColDef = defaultGridColDef,
  getRowId = getGridRowId,
  context,
}) {
  columnDefs[0].cellRenderer = LoadingCell

  return (
    <div
      style={{
        height: "100%",
        flex: 1,
      }}
    >
      <AgGridReact
        className="ag-theme-quartz-auto-dark"
        suppressMenuHide
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        context={context}
        getRowId={getRowId}
        rowModelType="infinite"
        datasource={datasource}
        cacheBlockSize={pageSize}
        rowBuffer={0}
        maxConcurrentDatasourceRequests={1}
        onGridReady={({ api, context }) => {
          context.api = api
        }}
        onBodyScrollEnd={({ api }) => {
          api.autoSizeAllColumns()
        }}
      />
    </div>
  )
}

export default DataGrid
export { valueFormatterDate, onCellValueChanged }

//#region
function getGridRowId({ data: { id } = {} }) {
  return id
}

function mapFilters(filterModel) {
  return Object.entries(filterModel).reduce(
    (
      acc,
      [
        key,
        { filterType, type: operand, filter: filterValue, dateFrom, dateTo },
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
            [`${key}_lte`]: formatIncludesDate({ lte: dateFrom }),
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
}

function LoadingCell({ value, api }) {
  if (value) {
    return value
  }

  if (api.getCacheBlockState()[0].pageStatus === "loading") {
    return null
  }

  return "Loading..."
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

async function onCellValueChanged({ api, data, oldValue, context }) {
  try {
    await context.update(data)
    toast.success("Updating success")
  } catch (err) {
    api.getRowNode(`${data.id}`).updateData({
      ...data,
      status: oldValue,
    })
    toast.error(`Updating error\nreason: ${err.message}`)
  }
}
//#endregion
