import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Box } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  programSpeName: "",
  programAssignmentIdOne: null,
  shortName: "",
  auid: "",
  acYearId: "",
  schoolId: "",
  programAssignmentId: "",
  deptId: "",
  programIdOne: null,
  displayName: "",
};

const requiredFields = [
  "programSpeName",
  "shortName",
  "schoolId",
  "programAssignmentId",
  "deptId",
];

function ProgramSpecializationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programSpecializationId, setProgramSpecializationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schoolData, setSchoolData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [programId, setProgramId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    programSpeName: [values.programSpeName !== ""],
    shortName: [
      values.shortName !== "",
      /^[A-Za-z ]{1,5}$/.test(values.shortName),
    ],
    auid: [values.auid !== "", /^[A-Za-z ]{1,3}$/.test(values.auid)],
  };

  const errorMessages = {
    programSpeName: ["This field is required"],
    shortName: [
      "This field required",
      "Enter characters length between 1 to 5",
    ],
    auid: [
      "This field required",
      "Enter characters and its length should be 3",
    ],
  };

  useEffect(() => {
    getSchool();
    if (
      pathname.toLowerCase() === "/academicmaster/programspecialization/new"
    ) {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster/Specialization" },
        { name: "Specialization" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramSpecializationData();
    }
  }, []);

  useEffect(() => {
    getDepartmentData();
    getProgramData();
  }, [values]);

  const getProgramSpecializationData = async () => {
    await axios
      .get(`/api/academic/ProgramSpecilization/${id}`)
      .then((res) => {
        setValues({
          programAssignmentId: res.data.data.program_assignment_id,
          programSpeName: res.data.data.program_specialization_name,
          shortName: res.data.data.program_specialization_short_name,
          auid: res.data.data.auid_format,
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programIdOne: res.data.data.program_id,
          deptId: res.data.data.dept_id,
          displayName: res.data.data.display_name,
        });
        axios
          .get(`/api/fetchdept1/${res.data.data.school_id}`)
          .then((res) => {
            setDepartmentData(
              res.data.data.map((obj) => ({
                value: obj.dept_id,
                label: obj.dept_name,
              }))
            );
          })
          .catch((err) => console.error(err));
        axios
          .get(
            `/api/academic/fetchAllProgramsWithProgramType/${res.data.data.school_id}`
          )
          .then((res) => {
            setProgramData(
              res.data.data.map((obj) => ({
                value: obj.program_assignment_id,
                label: obj.program_name,
              }))
            );
          })
          .catch((err) => console.error(err));
        setProgramSpecializationId(res.data.data.program_specialization_id);
        setCrumbs([
          { name: "AcademicMaster", link: "/AcademicMaster/Specialization" },
          { name: "Specialization" },
          { name: "Update" },
          { name: res.data.data.program_specialization_name },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolData(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getDepartmentData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          setDepartmentData(
            res.data.data.map((obj) => ({
              value: obj.dept_id,
              label: obj.dept_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const getProgramData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          setProgramData(
            res.data.data.map((obj) => ({
              value: obj.program_assignment_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const handleChange = async (e) => {
    if (e.target.name === "shortName" || e.target.name === "auid") {
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programAssignmentId") {
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.program_assignment_id === newValue) {
              setProgramId(val.program_id);
            }
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_specialization_name = values.programSpeName;
      temp.program_specialization_short_name = values.shortName;
      temp.auid_format = values.auid;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = programId;
      temp.dept_id = values.deptId;
      temp.program_assignment_id = values.programAssignmentId;
      temp.display_name = values.displayName;

      await axios
        .post(`/api/academic/ProgramSpecilization`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Program Specialization Created",
          });
          setAlertOpen(true);
          navigate("/AcademicMaster/Specialization", { replace: true });
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
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_specialization_id = programSpecializationId;
      temp.program_specialization_name = values.programSpeName;
      temp.program_specialization_short_name = values.shortName;
      temp.auid_format = values.auid;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = programId ? programId : values.programIdOne;
      temp.dept_id = values.deptId;
      temp.program_assignment_id = values.programAssignmentId;
      temp.display_name = values.displayName;

      await axios
        .put(`/api/academic/ProgramSpecilization/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program Specialization Updated",
            });
            navigate("/AcademicMaster/Specialization", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
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
              name="programSpeName"
              label="Program Specialization"
              value={values.programSpeName}
              handleChange={handleChange}
              fullWidth
              errors={errorMessages.programSpeName}
              checks={checks.programSpeName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              fullWidth
              errors={errorMessages.shortName}
              checks={checks.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="displayName"
              label="Display Name"
              value={values.displayName}
              handleChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              name="auid"
              label="AUID Format"
              value={values.auid}
              handleChange={handleChange}
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
              errors={errorMessages.auid}
              checks={checks.auid}
              disabled={!isNew}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="schoolId"
              value={values.schoolId}
              label="School"
              options={schoolData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="programAssignmentId"
              label="Program"
              value={values.programAssignmentId}
              options={programData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={departmentData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
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

export default ProgramSpecializationForm;
