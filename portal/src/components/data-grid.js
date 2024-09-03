import { ModuleRegistry } from "@ag-grid-community/core"
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model"
import { AG_GRID_LOCALE_RO } from "@ag-grid-community/locale"
import { AgGridReact, useGridFilter } from "@ag-grid-community/react"
import React, { useCallback, useEffect, useState } from "react"

import { i18n } from "@arasnet/i18n"
import { testingLocations, testingStatuses } from "@arasnet/types"

import ActionService from "../services/action-service"
import EventService from "../services/event-service"

ModuleRegistry.registerModules([InfiniteRowModelModule])

const pageSize = 20

const defaultGridColDef = {
  flex: 1,
  singleClickEdit: true,
  filterParams: {
    debounceMs: 500,
    maxNumConditions: 1,
  },
  sortable: false,
}

const datasource = {
  getRows: async ({
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

    try {
      const data = await context.read({
        _start,
        _end,
        _sort,
        _order,
        ...filters,
      })

      if (context.gridApi.isDestroyed()) {
        return
      }

      successCallback(
        data,
        data.length !== pageSize ? _start + data.length : null
      )

      context.gridApi.hideOverlay()

      if (_start === 0) {
        if (data.length === 0) {
          context.gridApi.showNoRowsOverlay()
        } else {
          setTimeout(() => {
            context.gridApi.autoSizeAllColumns()
          }, 50)
        }
      }
    } catch {
      if (context.gridApi.isDestroyed()) {
        return
      }

      failCallback()

      context.gridApi.hideOverlay()
    }
  },
}

function DataGrid({
  columnDefs,
  defaultColDef = defaultGridColDef,
  getRowId = getGridRowId,
  context,
}) {
  const [actions, setActions] = useState(ActionService.actions)

  columnDefs[0].cellRenderer = LoadingCell

  useEffect(() => {
    EventService.subscribe("actions", (actions) => {
      setActions(
        actions
          .filter(({ type }) => type === "data-grid")
          .map((action) => ({ ...action, fullWidth: true }))
      )
    })
  }, [])

  return (
    <AgGridReact
      className="data-grid ag-theme-quartz"
      suppressMenuHide
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      pinnedBottomRowData={actions}
      isFullWidthRow={isFullWidthRow}
      fullWidthCellRenderer={ActionButton}
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
      localeText={
        i18n.resolvedLanguage === "ro-RO"
          ? {
              ...AG_GRID_LOCALE_RO,
              noRowsToShow: "Nu există înregistrări",
            }
          : null
      }
    />
  )
}

export default DataGrid
export {
  dateFormatter,
  statusFormatter,
  locationFormatter,
  onCellValueChanged,
  DropdownColumnFilter,
}

//#region
function getGridRowId({ data: { id } = {} }) {
  return `${id}`
}

function isFullWidthRow({ rowNode: { data: { fullWidth } = {} } }) {
  return fullWidth
}

function mapFilters(filterModel) {
  return Object.entries(filterModel).reduce((acc, [key, value]) => {
    const {
      filterType = "text",
      type: operand = "equals",
      filter: filterValue,
      dateFrom,
      dateTo,
    } = typeof value === "string"
      ? {
          filter: value,
        }
      : value

    const filter = {
      text: {
        equals: {
          [key]: filterValue,
        },
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
  }, {})
}

function DropdownColumnFilter({ options, model, onModelChange }) {
  const [closeFilter, setCloseFilter] = useState()

  const afterGuiAttached = useCallback(({ hidePopup }) => {
    setCloseFilter(() => hidePopup)
  }, [])

  useGridFilter({
    afterGuiAttached,
  })

  return (
    <div className="ag-filter-body-wrapper ag-simple-filter-body-wrapper">
      <select
        className="ag-picker-field-wrapper"
        value={model || i18n.t("generic.plural.all")}
        onChange={({ target: { value } }) => {
          onModelChange(value === i18n.t("generic.plural.all") ? null : value)

          if (closeFilter) {
            closeFilter()
          }
        }}
      >
        <option>{i18n.t("generic.plural.all")}</option>

        {(options instanceof Array
          ? options
          : Object.entries(options).map(([value, { label }]) => [label, value])
        ).map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option[1]} value={option[1]}>
              {option[0]}
            </option>
          )
        )}
      </select>
    </div>
  )
}

function LoadingCell({ valueFormatted, value, api }) {
  if (valueFormatted || value) {
    return valueFormatted || value
  }

  if (api.getCacheBlockState()[0].pageStatus === "loading") {
    return null
  }

  return "Loading..."
}

function ActionButton({ data: { label, handler } = {} }) {
  if (!label || !handler) {
    return null
  }

  return (
    <button
      type="button"
      style={{
        borderRadius: 0,
        width: "100%",
        height: "100%",
        textAlign: "center",
      }}
      className="full-width-cell-renderer"
      onClick={handler}
    >
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

function dateFormatter({ value }) {
  return value
    ? new Intl.DateTimeFormat(i18n.resolvedLanguage, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(value))
    : value
}

function statusFormatter({ value }) {
  return value ? testingStatuses[value].label : value
}

function locationFormatter({ value }) {
  return value ? testingLocations[value].label : value
}

async function onCellValueChanged({ api, data, oldValue, context }) {
  try {
    await context.update(data)
  } catch (err) {
    api.getRowNode(`${data.id}`).updateData({
      ...data,
      status: oldValue,
    })
  }
}
//#endregion
