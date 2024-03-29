import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

// name: string
// label: string
// value: any[]
// options: { value: any, label: string }[]
// handleChangeAdvance: () => void
// helperText?: string
// errors?: string[]
// checks?: boolean[]
// required?: boolean
// disabled?: boolean

// Initialise your state to empty array []

function CustomMultipleAutocomplete({
  name,
  label,
  value,
  options,
  handleChangeAdvance,
  helperText = "",
  errors = [],
  checks = [],
  required = false,
  disabled = false,
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
    <Autocomplete
      size="small"
      fullWidth
      multiple
      disableCloseOnSelect
      options={options}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      value={
        options.filter((op) => value.includes(op.value))
          ? options.filter((op) => value.includes(op.value))
          : null
      }
      onChange={(e, val) => {
        handleChangeAdvance(
          name,
          val.map((obj) => obj.value)
        );
      }}
      onBlur={() => {
        if (error) setShowError(true);
        else setShowError(false);
      }}
      renderInput={(params) => (
        <TextField
          label={label}
          required={required}
          helperText={showError && !!errors[index] ? errors[index] : helperText}
          error={!!errors[index] && showError}
          {...params}
        />
      )}
    />
  );
}

export default CustomMultipleAutocomplete;
