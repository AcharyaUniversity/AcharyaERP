import React from "react";
import { Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import background from "../../images/background.jpeg";
import CustomTextField from "../../components/Inputs/CustomTextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
    marginTop: "40px !important",
    backgroundColor: "#00A29A !important",
  },

  anchorTag: {
    textDecoration: "none",
    color: "#00A29A !important",
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
}));

function StudentLogin() {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
  });

  const classes = styles();

  function handleUsername(e) {
    setValues((prev) => ({ ...prev, username: e.target.value }));
  }

  function authenticateStudent() {
    alert("Still api is not created");
    fetch("", {
      method: "POST",
      headers: {
        "Contect-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      response.json().then((result) => {
        if (
          values.username === result.userName &&
          values.password === result.userName
        ) {
          localStorage.setItem(
            "studentauthenticate",
            JSON.stringify({
              Studentlogin: true,
              username1: result.userName,
              token: result.token,
              userId: result.userId,
            })
          );
          setValues({
            Studentlogin: true,
          });
        } else {
          alert("unauthorized");
          setValues({ Studentlogin: false });
        }
      });
    });
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={0}
        columnSpacing={{ xs: 2, md: 2 }}
      >
        <Grid item xs={12}>
          <CustomTextField
            id="standard-basic"
            label="Enter AUID"
            variant="standard"
            style={{ marginTop: "30px" }}
            handleChange={handleUsername}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: "20px" }}>
          <FormControl fullWidth variant="standard">
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              fullWidth
              id="standard-adornment-password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            className={classes.btn}
            variant="contained"
            onClick={authenticateStudent}
            type="submit"
          >
            LOGIN
          </Button>
        </Grid>
        <Grid item xs={8} md={6} style={{ marginTop: "30px" }}>
          <a href="/ForgotPassword" className={classes.anchorTag}>
            Forgot Password ?
          </a>
        </Grid>
      </Grid>
    </>
  );
}
export default StudentLogin;
