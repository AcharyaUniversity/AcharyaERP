import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import ApiUrl from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
const initialValues = {
  deptId: "",
  priority: "",
  schoolId: [],
};

const requiredFields = ["priority", "schoolId"];

function DepartmentAssignmentForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [deptAssignmentId, setDeptAssignmentId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptData, setDeptData] = useState([]);

  useEffect(() => {
    getDept();
    if (pathname.toLowerCase() === "/academicmaster/departmentassignment/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster" },
        { name: "Department Assigment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getAssignmentData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getAssignmentData = () => {
    axios
      .get(`${ApiUrl}/DepartmentAssignment/${id}`)
      .then((res) => {
        setValues({
          deptId: res.data.data.dept_id,
          priority: res.data.data.priority,
          schoolId: res.data.data.school_id,
        });
        setDeptAssignmentId(res.data.data.dept_assign_id);
        setCrumbs([
          { name: "AcademicMaster", link: "/AcademicMaster" },
          { name: "Department Assigment" },
          { name: "Update" },
          { name: res.data.data.dept_assign_id },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getDept = () => {
    axios
      .get(`${ApiUrl}/dept`)
      .then((res) => {
        setDeptData(
          res.data.data.map((obj) => ({
            value: obj.dept_id,
            label: obj.dept_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "deptId") {
      axios
        .get(`${ApiUrl}/allUnassignedSchoolToDepartment/${newValue}`)
        .then((res) => {
          setSchoolOptions(
            res.data.data.map((obj) => ({
              value: obj.school_id,
              label: obj.school_name,
            }))
          );
        })
        .catch((err) => {
          console.error(err);
        });
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
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
      temp.dept_id = values.deptId;
      temp.priority = values.priority;
      temp.school_id = values.schoolId;
      await axios
        .post(`${ApiUrl}/DepartmentAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Department Assignment Created",
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
      temp.dept_assign_id = deptAssignmentId;
      temp.dept_id = values.deptId;
      temp.priority = values.priority;
      temp.school_id = values.schoolId;

      await axios
        .put(`${ApiUrl}/DepartmentAssignment/${id}`, temp)
        .then((response) => {
          setLoading(false);
          if (response.status === 200 || response.status === 201) {
            navigate("/AcademicMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Department Assignment Updated",
            });
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
                <CustomAutocomplete
                  name="deptId"
                  label="Department"
                  value={values.deptId}
                  options={deptData}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  name="priority"
                  label="Priority"
                  value={values.priority}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.priority !== ""]}
                  setFormValid={setFormValid}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {isNew ? (
                  <CustomMultipleAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    errors={["This field is required"]}
                    checks={[values.schoolId.length > 0]}
                    setFormValid={setFormValid}
                    required
                  />
                ) : (
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                )}
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
export default DepartmentAssignmentForm;
