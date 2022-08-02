import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function CustomPassword({
  name,
  value,
  handleChange,
  error,
  _type,
  ...props
}) {
  const handleClickShowPassword = () => {
    setShowPassword((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth>
      <InputLabel size="small">Password</InputLabel>
      <OutlinedInput
        fullWidth
        size="small"
        variant="outlined"
        name={name}
        type={showPassword.showPassword ? "text" : "password"}
        value={value}
        onChange={handleChange}
        error={!!error}
        {...props}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
