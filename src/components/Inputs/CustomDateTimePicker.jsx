import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

// name: string
// value: dayjs Object | null
// handleChangeAdvance: () => void
// seconds?: boolean
// errors?: string[]
// checks?: boolean[]
// required?: boolean
// ...props? any additional props to MUI MobileDateTimePicker

function CustomDateTimePicker({
  name,
  value,
  handleChangeAdvance,
  seconds = false,
  errors = [],
  checks = [],
  required = false,
  ...props
}) {
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let flag = false;
    for (let i = 0; i < checks.length; i++) {
      if (!checks[i]) {
        flag = true;
        setError(true);
        setIndex(i);
        break;
      }
    }
    if (!flag) {
      setError(false);
      setShowError(false);
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDateTimePicker
        value={value}
        views={
          seconds
            ? ["year", "day", "hours", "minutes", "seconds"]
            : ["year", "day", "hours", "minutes"]
        }
        inputFormat={seconds ? "DD/MM/YYYY hh:mm:ss A" : "DD/MM/YYYY hh:mm A"}
        openTo="day"
        closeOnSelect
        onChange={(val) => {
          handleChangeAdvance(name, val);
        }}
        ampmInClock
        renderInput={(params) => (
          <TextField
            required={required}
            size="small"
            fullWidth
            error={showError}
            helperText={
              showError && !!errors[index]
                ? errors[index]
                : seconds
                ? "dd/mm/yyyy hh:mm:ss"
                : "dd/mm/yyyy hh:mm"
            }
            onBlur={() => {
              if (error) setShowError(true);
              else setShowError(false);
            }}
            {...params}
          />
        )}
        sx={seconds ? { minWidth: 360 } : {}}
        {...props}
      />
    </LocalizationProvider>
  );
}

export default CustomDateTimePicker;
