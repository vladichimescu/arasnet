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
        return availableDates.some(([openDay, openHours, closeHours]) => {
          const [openHour, openMinutes] = openHours.split(":")
          const startDate = new Date(selectedDate)
          startDate.setHours(openHour, openMinutes, 0, 0)
          const startDay = startDate.getUTCDay()

          const [closeHour, closeMinutes] = closeHours.split(":")
          const endDate = new Date(selectedDate)
          endDate.setHours(closeHour, closeMinutes, 0, 0)
          const endDay = endDate.getUTCDay()

          return startDay === openDay || endDay === openDay
        })
      }

      return true
    },
    [availableDates]
  )

  const filterTime = useCallback(
    (time) => {
      const selectedDate = new Date(time)
      const currentDate = new Date()

      if (currentDate.getTime() > selectedDate.getTime()) {
        return false
      }

      if (unavailableDates) {
        if (unavailableDates.includes(selectedDate.toISOString())) {
          return false
        }
      }

      if (availableDates) {
        const selectedDay = selectedDate.getUTCDay()
        const selectedTime = selectedDate.getTime()

        return availableDates.some(([openDay, openHours, closeHours]) => {
          if (openDay !== selectedDay) {
            return false
          }

          const [openHour, openMinutes] = openHours.split(":")
          const openTime = new Date(selectedDate).setUTCHours(
            openHour,
            openMinutes,
            0,
            0
          )

          const [closeHour, closeMinutes] = closeHours.split(":")
          const closeTime = new Date(selectedDate).setUTCHours(
            closeHour,
            closeMinutes,
            0,
            0
          )

          return openTime <= selectedTime && closeTime > selectedTime
        })
      }

      return true
    },
    [unavailableDates, availableDates]
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
