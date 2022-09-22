import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const initialValues = {
  jobType: "",
  jobShortName: "",
};
const requiredFields = ["jobType", "jobShortName"];

function JobtypeForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [jobtypeId, setJobTypeId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/jobtype/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster" },
        { name: "Jobtype" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getJobtypeData();
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
    }
  }, []);

  const getJobtypeData = () => {
    axios
      .get(`${ApiUrl}/employee/JobType/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setValues({
          jobType: res.data.data.job_type,
          jobShortName: res.data.data.job_short_name,
        });
        setJobTypeId(res.data.data.job_type_id);
        setCrumbs([
          { name: "InstituteMaster", link: "/InstituteMaster" },
          { name: "Jobtype" },
          { name: "Update" },
          { name: res.data.data.job_type },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    if (e.target.name === "jobShortName") {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      const temp = {};
      temp.active = true;
      temp.job_type = values.jobType;
      temp.job_short_name = values.jobShortName;

      await axios
        .post(`${ApiUrl}/employee/JobType`, temp)
        .then((res) => {
          if (res.data.status === 200 || res.data.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Jobtype Created",
            });
            setAlertOpen(true);
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      const temp = {};
      temp.active = true;
      temp.job_type_id = jobtypeId;
      temp.job_type = values.jobType;
      temp.job_short_name = values.jobShortName;
      await axios
        .put(`${ApiUrl}/employee/JobType/${id}`, temp)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Jobtype Updated",
            });
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: response.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          console.log(error.response.data.message);
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
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="jobType"
                  label="Job Type"
                  value={values.jobType ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.jobType !== "",
                    /^[A-Za-z ]+$/.test(values.jobType),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="jobShortName"
                  label="Short Name"
                  value={values.jobShortName ?? ""}
                  handleChange={handleChange}
                  inputProps={{
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    values.jobShortName !== "",
                    /^[A-Za-z ]{3}$/.test(values.jobShortName),
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
                  <Grid item xs={2}>
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
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default JobtypeForm;
