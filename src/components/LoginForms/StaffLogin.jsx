import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ApiUrl from "../../services/Api";
import background from "../../images/background.jpeg";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomPassword from "../../components/Inputs/CustomPassword";
import CustomSnackbar from "../../components/CustomSnackbar";
import axios from "axios";
const styles = makeStyles(() => ({
  form: {
    padding: "10px 0",
    background: `url(${background})`,
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  },
  textField: {
    fontFamily: "Open Sans",
    cursor: "none",
  },

  btn: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    backgroundColor: "#00A29A !important",
  },

  anchorTag: {
    textDecoration: "none",
    color: "#00A29A !important",
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
}));

function StaffLogin() {
  const [values, setValues] = useState({
    active: true,
    username: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
  });

  const [submitError, setSubmitError] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const classes = styles();

  function authenticateErp(e) {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSubmitError(true);
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      setSubmitError(false);
      console.log("submitted");
    }
    axios
      .post(`${ApiUrl}/authenticate`, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      })
      .then((response) => {
        console.log(response);
        if (
          values.username == response.data.data.userName &&
          values.password == response.data.data.userName
        ) {
          localStorage.setItem(
            "authenticate",
            JSON.stringify({
              login: true,
              username1: response.data.data.userName,
              token: response.data.data.token,
              userId: response.data.data.userId,
            })
          );
          if (response.status == 200) {
            window.location.href = "/Header";
          }
          setValues({
            login: true,
          });
        } else {
          alert("Unauthorized");
          setValues({ login: false });
        }
      })
      .catch(() => {
        alert("Error");
      });
  }

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={2}
        columnSpacing={{ xs: 2, md: 2 }}
      >
        <CustomSnackbar
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
          severity={submitError ? "error" : "success"}
          message={
            submitError ? "Please fill all required fields" : "Form submitted"
          }
        />
        <Grid item xs={12}>
          <CustomTextField
            name="username"
            label="Enter Username"
            value={values.username}
            handleChange={handleChange}
            fullWidth
            errors={["Invalid Username"]}
            checks={[values.username !== ""]}
            setFormValid={setFormValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <CustomPassword
            name="password"
            label="Password"
            handleChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            className={classes.btn}
            variant="contained"
            onClick={authenticateErp}
            type="submit"
          >
            LOGIN
          </Button>
        </Grid>
        <Grid item xs={10} md={6} sx={{ marginBottom: "80px" }}>
          <a href="/ForgotPassword" className={classes.anchorTag}>
            Forgot Password ?
          </a>
        </Grid>{" "}
      </Grid>
    </>
  );
}
export default StaffLogin;
