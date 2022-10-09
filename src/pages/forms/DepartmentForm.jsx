import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import FormWrapper from "../../components/FormWrapper";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const initialValues = {
  deptName: "",
  deptShortName: "",
  webStatus: "",
  commonService: "",
};
const requiredFields = [
  "deptName",
  "deptShortName",
  "webStatus",
  "commonService",
];

function DepartmentForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [deptId, setDeptId] = useState(null);
  const [formValid, setFormValid] = useState({});
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (pathname.toLowerCase() === "/academicmaster/department/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Department" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getDepartmentData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getDepartmentData = () => {
    axios.get(`${ApiUrl}/dept/${id}`).then((res) => {
      setValues({
        deptName: res.data.data.dept_name,
        deptShortName: res.data.data.dept_name_short,
        webStatus: res.data.data.web_status,
        commonService: res.data.data.common_service,
      });
      setDeptId(res.data.data.dept_id);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Department" },
        { name: "Update" },
        { name: res.data.data.dept_name },
      ]);
    });
  };

  const handleChange = (e) => {
    if (e.target.name == "deptShortName") {
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
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service = values.commonService;
      await axios
        .post(`${ApiUrl}/dept`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
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

  const handleUpdate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.dept_id = deptId;
      temp.dept_name = values.deptName;
      temp.dept_name_short = values.deptShortName;
      temp.web_status = values.webStatus;
      temp.common_service = values.commonService;
      await axios
        .put(`${ApiUrl}/dept/${id}`, temp)
        .then((response) => {
          setLoading(false);
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/AcademicMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: response.data.message,
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="deptName"
                  label="Department"
                  value={values.deptName}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.deptName !== "",
                    /^[A-Za-z ]+$/.test(values.deptName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="deptShortName"
                  label="Short Name"
                  value={values.deptShortName}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    values.deptShortName !== "",
                    /^[A-Za-z ]{3}$/.test(values.deptShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomRadioButtons
                  name="webStatus"
                  label="Web Status "
                  value={values.webStatus}
                  items={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.webStatus !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  name="commonService"
                  label="Common Service"
                  value={values.commonService}
                  items={[
                    {
                      value: true,
                      label: "Yes",
                    },
                    {
                      value: false,
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.commonService !== ""]}
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
export default DepartmentForm;
