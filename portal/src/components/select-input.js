import React, { Fragment, useEffect, useState } from "react"

import DebounceInput from "./debounce-input"

function SelectInput({
  name,
  list,
  selection: defaultSelection = ["", ""],
  onChange,
  required,
  ...props
}) {
  const [selection, setSelection] = useState(defaultSelection)

  const selectValue = selection[0]
  const inputValue = selection[1]

  useEffect(() => {
    if (!selection[0] || !selection[1]) {
      return
    }

    if (JSON.stringify(selection) === JSON.stringify(defaultSelection)) {
      return
    }

    onChange(selection)
  }, [defaultSelection, selection, list, onChange])

  return (
    <Fragment>
      <select
        value={selectValue}
        onChange={(e) => {
          setSelection((data) => [e.target.value, data[1]])
        }}
        autoFocus={list.length > 2}
        required={required}
        {...props}
      >
        {list.map((item) => (
          <option key={item[0]} value={item[0]}>
            {item[1].label}
          </option>
        ))}
      </select>

      <DebounceInput
        defaultValue={inputValue}
        onChange={(e) => {
          setSelection((data) => [data[0], e.target.value])
        }}
        required={required}
      />

      {selectValue && inputValue ? (
        <Fragment>
          <input readOnly hidden name={name} type="text" value={selectValue} />

          <input readOnly hidden name={name} type="text" value={inputValue} />
        </Fragment>
      ) : null}
    </Fragment>
  )
}

export default SelectInput
