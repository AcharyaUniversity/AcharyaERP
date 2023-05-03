import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress, duration } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  objective: "",
  duration: "",
  moduleName: "",
  syllbusId: null,
};

const requiredFields = [];

function SyllabusForm() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState([initialValues]);
  const [data, setData] = useState({ courseId: null });
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moduleCount, setModuleCount] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    getCourseData();
    if (pathname.toLowerCase() === "/coursesubjectivemaster/syllabus/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "CourseSubjectiveMaster",
          link: "/CourseSubjectiveMaster/Syllabus",
        },
        { name: "Syllabus" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSyllabusObjectiveData();
    }
  }, [pathname]);

  const checks = {};

  const errorMessages = {};

  if (values.length > 0) {
    values.map((obj, i) => {
      checks["duration" + i] = [/[0-9]{2}$/.test(obj.duration)];
      errorMessages["duration" + i] = ["Enter two numbers"];
    });
  }

  const getCourseData = async () => {
    await axios
      .get(`/api/academic/getCoursesConcateWithCodeNameAndYearSem`)
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_id,
            label: obj.course,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSyllabusObjectiveData = async () => {
    await axios
      .get(`/api/academic/syllabus/${id}`)
      .then((res) => {
        setData({ courseId: res.data.data[0].course_id });
        const updatedData = [];
        for (let i = 0; i < res.data.data.length; i++) {
          updatedData.push({
            syllbusId: res.data.data[i].id,
            moduleName: res.data.data[i].module,
            objective: res.data.data[i].syllabus_objective,
            duration: res.data.data[i].duration,
          });
        }

        setValues(updatedData);
        setCrumbs([
          {
            name: "CourseSubjectiveMaster",
            link: "/CourseSubjectiveMaster/Syllabus",
          },
          { name: "Syllabus" },
          { name: "Update" },
          { name: res.data.data.syllabus_id },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      await axios
        .get(`/api/academic/getCountOfModules/${newValue}`)
        .then((res) => {
          setModuleCount(res.data.data);
        })
        .catch((error) => console.error(error));
    }
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");
    setValues((prev) =>
      prev.map((obj, i) => {
        if (i === Number(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
            ["moduleName"]: "Module" + "-" + Number(moduleCount + i + 1),
          };
        return obj;
      })
    );
  };

  const addRow = () => {
    setValues((prev) => [...prev, initialValues]);
  };

  const deleteRow = () => {
    const filtered = [...values];
    filtered.pop();
    setValues(filtered);
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = [];

      values.map((obj) => {
        temp.push({
          active: true,
          course_id: data.courseId,
          module: obj.moduleName,
          duration: obj.duration,
          syllabus_objective: obj.objective,
        });
      });

      await axios
        .post(`/api/academic/syllabusObjective`, temp)
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
          navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
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
          console.error(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = [];

      values.map((obj) => {
        temp.push({
          active: true,
          syllabus_id: obj.syllbusId,
          course_id: data.courseId,
          module: obj.moduleName,
          duration: obj.duration,
          syllabus_objective: obj.objective,
        });
      });

      await axios
        .put(`/api/academic/syllabus/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
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
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={data.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                required
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            {values.map((obj, i) => {
              return (
                <>
                  <Grid item xs={12} md={8} mt={2} key={i}>
                    <CustomTextField
                      rows={4}
                      multiline
                      name={"objective" + "-" + i}
                      label={"Module" + "-" + Number(moduleCount + i + 1)}
                      value={obj.objective}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4} mt={2}>
                    <CustomTextField
                      name={"duration" + "-" + i}
                      label="Duration (hrs)"
                      value={obj.duration}
                      handleChange={handleChange}
                      checks={checks["duration" + i]}
                      errors={errorMessages["duration" + i]}
                      inputProps={{
                        maxLength: 2,
                      }}
                      required
                    />
                  </Grid>
                </>
              );
            })}
          </Grid>

          <Grid container rowSpacing={5} justifyContent="flex-end">
            {isNew ? (
              <>
                <Grid item xs={12} textAlign="right">
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      borderRadius: 2,
                      marginRight: "10px",
                    }}
                    onClick={addRow}
                  >
                    <AddIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      borderRadius: 2,
                    }}
                    onClick={deleteRow}
                  >
                    <RemoveIcon />
                  </Button>
                </Grid>
                <Grid item xs={12} textAlign="right">
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <strong>{"Create"}</strong>
                    )}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} textAlign="right">
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  onClick={handleUpdate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{"Update"}</strong>
                  )}
                </Button>
              </Grid>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default SyllabusForm;
