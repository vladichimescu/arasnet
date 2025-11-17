import enGB from "date-fns/locale/en-GB"
import ro from "date-fns/locale/ro"
import React, { Fragment, useCallback, useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker"

registerLocale("en-GB", enGB)
registerLocale("ro-RO", ro)

function DateTimeInput({ name, availableDates, unavailableDates, ...props }) {
  const [selectedDate, setSelectedDate] = useState()
  const [date, setDate] = useState("")

  const filterDate = useCallback(
    (date) => {
      const selectedDate = new Date(date)
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      if (currentDate.getTime() > selectedDate.getTime()) {
        return false
      }

      if (availableDates) {
        return availableDates.some(
          ([locale, openDay, openHours, closeHours]) => {
            const [openHour, openMinutes] = openHours.split(":")
            const startDate = new Date(selectedDate)
            startDate.setHours(openHour, openMinutes, 0, 0)
            const startDay = startDate.getUTCDay()

            const [closeHour, closeMinutes] = closeHours.split(":")
            const endDate = new Date(selectedDate)
            endDate.setHours(closeHour, closeMinutes, 0, 0)
            const endDay = endDate.getUTCDay()

            return startDay === openDay || endDay === openDay
          }
        )
      }

      return true
    },
    [availableDates]
  )

  const filterTime = useCallback(
    (time) => {
      const selectedUtcDate = new Date(time)
      const nowUtc = new Date()

      if (selectedUtcDate <= nowUtc) {
        return false
      }

      if (unavailableDates?.includes(selectedUtcDate.toISOString())) {
        return false
      }

      if (!availableDates) {
        return true
      }

      return availableDates.some(([locale, openDay, openHours, closeHours]) => {
        const timeZone = Intl.DateTimeFormat(locale).resolvedOptions().timeZone

        const localSelected = getLocalDateParts(selectedUtcDate, timeZone)

        if (localSelected.weekday !== openDay) {
          return false
        }

        const openTimestamp = buildLocalTimestamp(
          localSelected,
          openHours,
          timeZone
        )
        const closeTimestamp = buildLocalTimestamp(
          localSelected,
          closeHours,
          timeZone
        )

        return (
          localSelected.timestamp >= openTimestamp &&
          localSelected.timestamp < closeTimestamp
        )
      })
    },
    [availableDates, unavailableDates]
  )

  return (
    <Fragment>
      <DatePicker
        inline
        showTimeSelect
        showTimeCaption={false}
        locale={document.documentElement.lang}
        selected={selectedDate}
        onChange={(value) => {
          if (filterTime(value)) {
            setDate(value.toISOString())
          } else {
            setDate("")
          }

          setSelectedDate(value)
        }}
        timeIntervals={15}
        filterTime={filterTime}
        filterDate={filterDate}
        {...props}
      />

      <input readOnly hidden name={name} type="text" value={date} />
    </Fragment>
  )
}

export default DateTimeInput

//#region
function getLocalDateParts(utcDate, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
  })

  const parts = formatter.formatToParts(utcDate).reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value
    }

    return acc
  }, {})

  const weekdayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  }

  const localIsoString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: weekdayMap[parts.weekday],
    timestamp: new Date(localIsoString).getTime(),
  }
}

function buildLocalTimestamp(localParts, timeString, timeZone) {
  const [hour, minute] = timeString.split(":").map(Number)

  const isoLocal =
    `${localParts.year}-` +
    `${String(localParts.month).padStart(2, "0")}-` +
    `${String(localParts.day).padStart(2, "0")}T` +
    `${String(hour).padStart(2, "0")}:` +
    `${String(minute).padStart(2, "0")}:00`

  return new Date(
    new Date(isoLocal).toLocaleString("en-US", { timeZone })
  ).getTime()
}

//#endregion
