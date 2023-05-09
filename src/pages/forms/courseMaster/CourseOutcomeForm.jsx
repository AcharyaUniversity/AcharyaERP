import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const initValues = {
  courseId: null,
  courseName: "",
  courseCode: "",
};

const initialValues = {
  courseOutcomeId: null,
  courseOutcomeObjective: "",
  courseOutcomeCode: "",
};

const requiredFields = [];

function CourseOutcomeForm() {
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState(initValues);
  const [values, setValues] = useState([initialValues]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseObjectiveCount, setCourseObjectiveCount] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    getCourseData();
    if (
      pathname.toLowerCase() === "/coursesubjectivemaster/courseoutcome/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "CourseSubjectiveMaster",
          link: "/CourseSubjectiveMaster/Outcome",
        },
        { name: "Course Outcome " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCourseOutcomeData();
    }
  }, [pathname]);

  const checks = {};

  const getCourseData = async () => {
    await axios
      .get(`/api/academic/getCoursesForOutCome`)
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_id,
            label: obj.courseconcat,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getCourseOutcomeData = async () => {
    await axios
      .get(`/api/academic/listOfcourseOutCome/${id}`)
      .then((res) => {
        setData({ courseId: res.data.data[0].course_id });
        const updatedData = [];
        for (let i = 0; i < res.data.data.length; i++) {
          updatedData.push({
            courseOutcomeId: res.data.data[i].course_outcome_id,
            courseOutcomeObjective: res.data.data[i].course_outcome_objective,
            courseOutcomeCode: res.data.data[i].course_outcome_code,
          });
        }

        setValues(updatedData);
        setCrumbs([
          { name: "CourseMaster", link: "/CourseSubjectiveMaster/Outcome" },
          { name: "Course Outcome" },
          { name: "Update" },
          { name: res.data.data.course_objective_id },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");
    setValues((prev) =>
      prev.map((obj, i) => {
        if (i === Number(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
            ["courseOutcomeCode"]:
              "CO" + "-" + Number(courseObjectiveCount + i + 1),
          };
        return obj;
      })
    );
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "courseId") {
      await axios.get(`/api/academic/getCoursesForOutCome`).then((res) => {
        res.data.data
          .filter((item) => item.course_id === newValue)
          .map((filteredItem) => {
            data.courseName = filteredItem.course_name;
            data.courseCode = filteredItem.course_code;
          });
      });

      await axios
        .get(`/api/academic/getCountOfOutcome/${newValue}`)
        .then((res) => {
          setCourseObjectiveCount(res.data.data);
        })
        .catch((error) => console.error(error));
    }
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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
          course_outcome_objective: obj.courseOutcomeObjective,
          course_outcome_code: obj.courseOutcomeCode,
          course_name: data.courseName,
          course_id: data.courseId,
        });
      });

      await axios
        .post(`/api/academic/courseOutCome`, temp)
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
          navigate("/CourseSubjectiveMaster/Outcome", { replace: true });
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
          course_outcome_code: obj.courseOutcomeCode,
          course_outcome_objective: obj.courseOutcomeObjective,
          course_outcome_id: obj.courseOutcomeId,
          course_name: data.courseName,
          course_id: data.courseId,
        });
      });

      await axios
        .put(`/api/academic/outcome/${id}`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Updated Successfully",
          });
          navigate("/CourseSubjectiveMaster/Outcome", { replace: true });
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
                <Grid item xs={12} md={8} mt={2} key={i}>
                  <CustomTextField
                    rows={2.8}
                    multiline
                    name={"courseOutcomeObjective" + "-" + i}
                    label={"CO" + "-" + Number(courseObjectiveCount + i + 1)}
                    value={obj.courseOutcomeObjective}
                    handleChange={handleChange}
                    required
                  />
                </Grid>
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

export default CourseOutcomeForm;
