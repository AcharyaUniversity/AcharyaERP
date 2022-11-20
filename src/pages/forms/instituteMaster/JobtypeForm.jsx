import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  jobType: "",
  jobShortName: "",
};

const requiredFields = ["jobType", "jobShortName"];

function JobtypeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [jobTypeId, setJobTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    jobType: [values.jobType !== "", /^[A-Za-z ]+$/.test(values.jobType)],
    jobShortName: [
      values.jobShortName !== "",
      /^[A-Za-z ]{3}$/.test(values.jobShortName),
    ],
  };

  const errorMessages = {
    jobType: ["This field required", "Enter Only Characters"],
    jobShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/jobtype/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster/JobType" },
        { name: "Jobtype" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getJobtypeData();
    }
  }, [pathname]);

  const getJobtypeData = async () => {
    await axios(`${ApiUrl}/employee/JobType/${id}`)
      .then((res) => {
        setValues({
          jobType: res.data.data.job_type,
          jobShortName: res.data.data.job_short_name,
        });
        setJobTypeId(res.data.data.job_type_id);
        setCrumbs([
          { name: "Institute Master", link: "/InstituteMaster/JobType" },
          { name: "Jobtype" },
          { name: "Update" },
          { name: res.data.data.job_type },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.job_type = values.jobType;
      temp.job_short_name = values.jobShortName;
      await axios
        .post(`${ApiUrl}/employee/JobType`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/JobType", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Jobtype created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.job_type_id = jobTypeId;
      temp.job_type = values.jobType;
      temp.job_short_name = values.jobShortName;
      await axios
        .put(`${ApiUrl}/employee/JobType/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/JobType", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Jobtype updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
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
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="jobType"
              label="Job Type"
              value={values.jobType ?? ""}
              handleChange={handleChange}
              checks={checks.jobType}
              errors={errorMessages.jobType}
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
              checks={checks.jobShortName}
              errors={errorMessages.jobShortName}
              required
            />
          </Grid>
          <Grid item xs={12} textAlign="right">
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
      </FormWrapper>
    </Box>
  );
}

export default JobtypeForm;
