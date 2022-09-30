import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ApiUrl from "../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  designation: "",
  shortName: "",
  priority: "",
};

const requiredFields = ["designation", "shortName", "priority"];

function DesignationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [formValid, setFormValid] = useState({});
  const [DesignationId, setDesignationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/designationmaster/designation/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "DesignationMaster", link: "/DesignationMaster" },
        { name: "Designation" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDesignationData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getDesignationData = () => {
    axios
      .get(`${ApiUrl}/employee/Designation/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setValues({
          designation: res.data.data.designation_name,
          shortName: res.data.data.designation_short_name,
          priority: res.data.data.priority,
        });
        setDesignationId(res.data.data.designation_id);
        setCrumbs([
          { name: "DesignationMaster", link: "/DesignationMaster" },
          { name: "Designation" },
          { name: "Update" },
          { name: res.data.data.designation_name },
        ]);
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.designation_name = values.designation;
      temp.designation_short_name = values.shortName;
      temp.priority = values.priority;

      await axios
        .post(`${ApiUrl}/employee/Designation`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/DesignationMaster", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.log(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.designation_id = DesignationId;
      temp.designation_name = values.designation;
      temp.designation_short_name = values.shortName;
      temp.priority = values.priority;

      await axios
        .put(`${ApiUrl}/employee/Designation/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/DesignationMaster", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="designation"
              label="Designation"
              handleChange={handleChange}
              value={values.designation}
              errors={["This field is required"]}
              checks={[
                values.designation !== "",
                values.designation.trim().split(/ +/).join(" "),
              ]}
              setFormValid={setFormValid}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be three",
              ]}
              checks={[
                values.shortName !== "",
                values.shortName.trim().split(/ +/).join(" "),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="priority"
              value={values.priority}
              handleChange={handleChange}
              label="Priority"
              errors={["This field is required", "Allow Only Number"]}
              checks={[
                values.priority !== "",
                /^[0-9]*$/.test(values.priority),
              ]}
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
            >
              <Grid item xs={4} md={2}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={isNew ? handleCreate : handleUpdate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{isNew ? "Create" : "Update"}</strong>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default DesignationForm;
