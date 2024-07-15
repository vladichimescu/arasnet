import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AgGridReact } from "@ag-grid-community/react"
import React from "react"
import { toast } from "react-toastify"

import { useActions } from "./actions-provider"

import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz-no-font.css"

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
      context.gridApi.showLoadingOverlay()
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

          context.gridApi.hideOverlay()

          if (_start === 0) {
            if (data.length === 0) {
              context.gridApi.showNoRowsOverlay()
            } else {
              setTimeout(() => context.gridApi.autoSizeAllColumns(), 50)
            }
          }
        },
        () => {
          failCallback()

          context.gridApi.hideOverlay()
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
  const { actions } = useActions()

  columnDefs[0].cellRenderer = LoadingCell

  return (
    <AgGridReact
      className="data-grid ag-theme-quartz-auto-dark"
      suppressMenuHide
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      pinnedBottomRowData={
        actions.length === 0
          ? null
          : actions
              .filter(({ type }) => type === "data-grid")
              .map((action) => ({ ...action, fullWidth: true }))
      }
      isFullWidthRow={isFullWidthRow}
      fullWidthCellRenderer={fullWidthCellRenderer}
      context={context}
      getRowId={getRowId}
      rowModelType="infinite"
      datasource={datasource}
      cacheBlockSize={pageSize}
      rowBuffer={0}
      maxConcurrentDatasourceRequests={1}
      onGridReady={({ api, context }) => {
        context.gridApi = api
      }}
      onBodyScrollEnd={({ api }) => {
        api.autoSizeAllColumns()
      }}
    />
  )
}

export default DataGrid
export { valueFormatterDate, onCellValueChanged }

//#region
function getGridRowId({ data: { id } = {} }) {
  return `${id}`
}

function isFullWidthRow({ rowNode: { data: { fullWidth } = {} } }) {
  return fullWidth
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

function fullWidthCellRenderer({ data: { label, handler } }) {
  return (
    <button className="full-width-cell-renderer" onClick={handler}>
      {label}
    </button>
  )
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
  } catch (err) {
    api.getRowNode(`${data.id}`).updateData({
      ...data,
      status: oldValue,
    })
    toast.error(`Updating error\nreason: ${err.message}`)
  }
}
//#endregion
