import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import axios from "axios";
import useAlert from "../hooks/useAlert";
import ApiUrl from "../services/Api";
import FormWrapper from "../components/FormWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const initialValues = {
  empType: "",
  empTypeShortName: "",
};
const requiredFields = ["empType", "empTypeShortName"];
function EmptypeForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    empType: false,
    empTypeShortName: false,
  });

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState(null);
  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/emptype/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster" },
        { name: "Employeetype" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getEmpData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getEmpData = () => {
    axios
      .get(`${ApiUrl}/employee/EmployeeType/${id}`)
      .then((res) => {
        setValues({
          empType: res.data.data.empType,
          empTypeShortName: res.data.data.empTypeShortName,
        });
        setEmpId(res.data.data.empTypeId);
        setCrumbs([
          { name: "InstituteMaster", link: "/InstituteMaster" },
          { name: "Employeetype" },
          { name: "Update" },
          { name: res.data.data.empType },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "empTypeShortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
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
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.empType = values.empType;
      temp.empTypeShortName = values.empTypeShortName;
      await axios
        .post(`${ApiUrl}/employee/EmployeeType`, temp)
        .then((res) => {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/InstituteMaster", { replace: true });
          setAlertOpen(true);
        })
        .catch((error) => {
          console.log(error);
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
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.empTypeId = empId;
      temp.empType = values.empType;
      temp.empTypeShortName = values.empTypeShortName;

      await axios
        .put(`${ApiUrl}/employee/EmployeeType/${id}`, temp)
        .then((response) => {
          setLoading(true);
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
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
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="empType"
                label="Employment type"
                value={values.empType}
                handleChange={handleChange}
                fullWidth
                errors={["This field required", "Enter Only Characters"]}
                checks={[
                  values.empType !== "",
                  /^[A-Za-z ]+$/.test(values.empType),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="empTypeShortName"
                label=" Short Name"
                value={values.empTypeShortName}
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
                  values.empTypeShortName !== "",
                  /^[A-Za-z ]{3}$/.test(values.empTypeShortName),
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
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default EmptypeForm;
