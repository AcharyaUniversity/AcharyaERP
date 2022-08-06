import { Box, Button, Grid, Paper } from "@mui/material";
import React from "react";

export default function CustomButton({ label }) {
  const center = {
    textAlign: "center",
    backgroundColor: "transparent",
  };
  return (
    <>
      <Paper elevation={0} sx={center}>
        <Button variant="contained" size="small" type="submit">
          {label}
        </Button>
      </Paper>
    </>
  );
}
