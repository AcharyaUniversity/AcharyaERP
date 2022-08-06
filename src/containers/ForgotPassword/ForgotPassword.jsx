import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Paper, Button } from "@mui/material";
import ApiUrl from "../../services/Api";
import CustomTextField from "../../components/Inputs/CustomTextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import axios from "axios";
const useStyles = makeStyles(() => ({
  form: {
    padding: "20px 0",
  },
  anchortag: {
    color: "grey",
    textDecoration: "none",
    borderRadius: 20,
  },
}));

function ForgotPassword() {
  const [storedata, setstoredata] = useState({
    email: "",
  });
  const [mail, setmail] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const paperStyle = {
    width: 320,
    height: 300,
    padding: 30,
    margin: "100px 50px",
    borderRadius: 20,
  };
  function alerts() {
    setOpen(true);
    setmail(true);
  }
  const handleClose = () => {
    setOpen(false);
    window.location.href = "/";
  };

  const onSubmit = () => {
    console.log(storedata);
    let path = "http://localhost:3000/ResetPassword?token=";
    axios
      .post(
        `${ApiUrl}/forgotPassword?url_domain=${path}&username=${storedata.username}`,
        storedata,
        {
          headers: {
            "Content-": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then(
        (response) => {
          console.log(response);
          setstoredata(response.data.data);
          if (response.status == 200) {
            alerts();
          }
          console.log("success");
          console.log(response.data);
        },

        (err) => {
          alert(err.response.data.message);
        }
      );
  };
  function handleUsername(e) {
    setstoredata((prev) => ({ ...prev, username: e.target.value }));
  }
  return (
    <>
      <Box component="form" className={classes.form}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          {" "}
          <Paper elevation={8} style={paperStyle}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12}>
                <h2>ERP password reset</h2>
              </Grid>
              <Grid item xs={12}>
                <h5>Please give username.</h5>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label="Username"
                  size="small"
                  handleChange={handleUsername}
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" onClick={onSubmit}>
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <a href="/" className={classes.anchortag}>
                  Back
                </a>
              </Grid>
              <Grid item>
                <Dialog open={open}>
                  <DialogContent>
                    <DialogContentText>
                      <h4>{storedata.message}</h4>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="contained" autoFocus>
                      Ok
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default ForgotPassword;
