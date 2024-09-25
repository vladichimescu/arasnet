import React, { Fragment, useCallback, useState } from "react"

import { i18n } from "@arasnet/i18n"

import SelectInput from "./select-input"

const defaultOption = [
  "",
  { label: i18n.t("page.partner.action.contacts.platformChoice") },
]
const removalOption = [
  "remove",
  { label: i18n.t("page.partner.action.contacts.platformRemoval") },
]

function MultiSelectInput({ list, required, ...props }) {
  const [fields, setFields] = useState([])
  const [availableList, setAvailableList] = useState(list)

  const onChange = useCallback(
    (value, index) => {
      if (!value) {
        return
      }

      setFields((data) => {
        const editedFields = [...data]

        if (typeof index === "number") {
          if (value[0] === "remove") {
            editedFields.splice(index, 1)
          } else {
            editedFields.splice(index, 1, value)
          }
        } else {
          editedFields.push(value)
        }

        const editedAvailableList = list.filter(([item]) =>
          editedFields.length === 0
            ? true
            : !editedFields.find(([selection]) => selection === item)
        )

        setAvailableList(editedAvailableList)

        return editedFields
      })
    },
    [list]
  )

  return (
    <Fragment>
      {fields.map((selection, index) => {
        const selectedOption = list.find(
          ([selectionId]) => selectionId === selection[0]
        )

        return (
          <SelectInput
            key={selection[0]}
            list={[removalOption, selectedOption]}
            onChange={(value) => onChange(value, index)}
            selection={selection}
            {...props}
          />
        )
      })}

      {availableList.length === 0 ? null : (
        <SelectInput
          key={fields.map(([selectionId]) => selectionId).join("-")}
          list={[defaultOption].concat(availableList)}
          onChange={onChange}
          required={required && fields.length === 0}
          {...props}
        />
      )}
    </Fragment>
  )
}

export default MultiSelectInput
