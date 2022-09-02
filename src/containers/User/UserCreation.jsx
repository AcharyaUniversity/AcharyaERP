import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomAlert from "../../components/CustomAlert";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import axios from "axios";
import ApiUrl from "../../services/Api";

const initialValues = {
  username: "",
  email: "",
  usertype: "",
  role_id: "",
};

const formValidInit = {
  username: false,
  usertype: false,
  role_id: false,
};

function UserCreation() {
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState(formValidInit);
  const [Role, setRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });

  useEffect(() => {
    getRoels();
  }, []);

  const getRoels = () => {
    axios.get(`${ApiUrl}/Roles`).then((res) => {
      setRole(
        res.data.data.map((obj) => ({
          value: obj.role_id,
          label: obj.role_name,
        }))
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.name == "username") {
      const email = e.target.value + "@acharya.ac.in";
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        email: email,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleChangeAdvance = (name, newValue) => {
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      await axios
        .post(`${ApiUrl}/UserAuthentication`, data)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "",
          });
          setAlertOpen(true);
          if (res.status === 200) {
            window.location.href = "/VoucherHeadAssignmentIndex";
          }
          if (res.status === 201) {
            window.location.href = "/VoucherHeadAssignmentIndex";
          }
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <>
      <Box component="form">
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          severity={alertMessage.severity}
          message={alertMessage.message}
        />
        <FormLayout>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  label="Username"
                  name="username"
                  value={data.username}
                  fullWidth
                  handleChange={handleChange}
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[data.username !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  label="Email"
                  name="email"
                  value={data.email}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  label="User Type"
                  name="usertype"
                  value={data.usertype}
                  items={[
                    { label: "Staff", value: "staff" },
                    { label: "Student", value: "student" },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomMultipleAutocomplete
                  name="role_id"
                  label="Role"
                  value={data.role_id}
                  options={Role}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                  rowSpacing={2}
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Submit</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </FormLayout>
      </Box>
    </>
  );
}
export default UserCreation;
