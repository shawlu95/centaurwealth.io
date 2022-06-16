import React from 'react'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

export default function DatePicker(props) {

  const { values, onChange } = props

  const convertToDefEventPara = (name, value) => ({
    target: {
      name, value
    }
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Date"
        name="date"
        variant="standard"
        value={values.date}
        minDate={new Date('2017-01-01')}
        onChange={(date) => onChange(convertToDefEventPara("date", date))}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
