import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";

const initValues = {
  userId: "",
  courseId: [],
  remarks: "",
  courseIdUpdate: null,
};

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const requiredFields = ["userId", "courseId", "remarks"];

function FacultySubjectAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [program, setProgram] = useState([]);
  const [Names, setNames] = useState([]);
  const [courseAssignId, setCourseAssignId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  const state = location?.state;

  useEffect(() => {
    getUserSchoolId();
    if (
      state === "school"
        ? pathname.toLowerCase() === "/facultysubjectassignmentschool"
        : state === "user"
        ? pathname.toLowerCase() === "/facultysubjectassignmentuser"
        : ""
    ) {
      setIsNew(true);
      state === "school"
        ? setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/School/Subject" },
            { name: "Subject Assignment" },
            { name: "Create" },
          ])
        : state === "user"
        ? setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/User/Subject" },
            { name: "Subject Assignment" },
            { name: "Create" },
          ])
        : setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/User/Subject" },
            { name: "Subject Assignment" },
            { name: "Create" },
          ]);
    } else {
      setIsNew(false);
      getCourseAssignmentData();
      state === "schoolupdate"
        ? setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/School/Subject" },
            { name: "Subject Assignment" },
            { name: "Update" },
          ])
        : state === "userupdate"
        ? setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/User/Subject" },
            { name: "Subject Assignment" },
            { name: "Update" },
          ])
        : setCrumbs([
            { name: "Faculty Master", link: "/FacultyMaster/User/Subject" },
            { name: "Subject Assignment" },
            { name: "Update" },
          ]);
    }
  }, [pathname]);

  const checks = {
    courseId: [values.courseId !== ""],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    courseId: ["This field required"],
    remarks: ["This field is required"],
  };

  const getUserSchoolId = async () => {
    await axios
      .get(`/api/getSchoolIdBasedOnUserId/${userID}`)
      .then((res) => {
        // console.log(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getCourseAssignmentData = async () => {
    await axios
      .get(`/api/academic/SubjectAssignment/${id}`)
      .then((res) => {
        setValues({
          userId: res.data.data.user_id,
          courseId: res.data.data.course_assignment_id,
          remarks: res.data.data.remarks,
        });
        setCourseAssignId(res.data.data.subjetAssignId);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
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

  useEffect(() => {
    getUnassignedPrograms();
    getNames();
  }, [values.userId]);

  const getUnassignedPrograms = async () => {
    await axios
      .get(`/api/academic/getAllActiveCourseDetailsData`)
      .then((res) => {
        setProgram(
          res.data.data.map((obj) => ({
            value: obj.course_assignment_id,
            label: `${obj.course_name}-${obj.year_sem}-${obj.course_code}-${obj.program_short_name}-${obj.program_specialization_short_name}`,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getNames = async () => {
    await axios
      .get(`/api/userDetailswithDepartment`)
      .then((res) => {
        setNames(
          res.data.data.map((obj) => ({
            value: obj.id,
            label: obj.username_with_department,
          }))
        );
      })
      .catch((err) => console.error(err));
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
      const temp = {};
      temp.active = true;
      temp.user_id = values.userId;
      temp.course_assignment_id = values.courseId;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/academic/SubjectAssignment`, temp)
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
          if (state === "school") {
            navigate("/FacultyMaster/School/Subject", { replace: true });
          } else if (state === "user") {
            navigate("/FacultyMaster/User/Subject", { replace: true });
          }
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
      const temp = {};
      temp.active = true;
      temp.subjetAssignId = courseAssignId;
      temp.user_id = values.userId;
      temp.course_assignment_id = values.courseId;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/academic/SubjectAssignment/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            if (state === "schoolupdate") {
              navigate("/FacultyMaster/School/Subject", { replace: true });
            } else if (state === "userupdate") {
              navigate("/FacultyMaster/User/Subject", { replace: true });
            }
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
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="userId"
              label="Faculty"
              options={Names}
              value={values.userId}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {isNew ? (
              <CustomMultipleAutocomplete
                name="courseId"
                label="Course"
                options={program}
                value={values.courseId}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.courseId}
                errors={errorMessages.courseId}
                required
              />
            ) : (
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={program}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              errors={errorMessages.remarks}
              checks={checks.remarks}
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
                <strong>{isNew ? "Assign" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default FacultySubjectAssignmentForm;
