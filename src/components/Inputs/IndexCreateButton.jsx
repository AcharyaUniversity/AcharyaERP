import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function IndexCreateButton({ label, path, handleClick }) {
  return (
    <>
      {/* <Link to={path} style={{ textDecoration: "none" }}> */}
      <Button
        variant="contained"
        size="small"
        sx={{ mt: 2 }}
        onClick={handleClick}
      >
        {label}
      </Button>
      {/* </Link> */}
    </>
  );
}
