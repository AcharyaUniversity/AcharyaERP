import { useState } from "react";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  errorText: {
    fontSize: 12,
    margin: "2px 10px",
    color: theme.palette.error.main,
  },
}));

// name: string
// value: Date | null
// handleChangeAdvance: () => void
// setFormValid?: () => void
// required?: boolean
// ...props? any additional props to mui DatePicker

function CustomDatePicker({
  name,
  value,
  handleChangeAdvance,
  setFormValid = () => {},
  required = false,
  ...props
}) {
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        inputFormat="dd/MM/yyyy"
        onChange={(val) => {
          handleChangeAdvance(name, val);
          setFormValid((prev) => ({ ...prev, [name]: true }));
          setShowError(false);
        }}
        renderInput={(params) => (
          <TextField
            required={required}
            size="small"
            fullWidth
            helperText="dd/mm/yyyy"
            onBlur={() => (value ? setShowError(false) : setShowError(true))}
            {...params}
          />
        )}
        {...props}
      />
      {required && showError && (
        <p className={classes.errorText}>This field is required</p>
      )}
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
