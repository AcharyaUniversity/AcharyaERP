import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTimePicker from "../../../components/Inputs/CustomTimePicker";
import { convertTimeToString } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";

const initValues = {
  shiftName: "",
  startTime: null,
  endTime: null,
};

const requiredFields = ["shiftName", "startTime", "endTime"];

function ShiftForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [shiftId, setShiftId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/shiftmaster/shift/new") {
      setIsNew(true);
      setCrumbs([
        { name: "ShiftMaster", link: "/ShiftMaster" },
        { name: "Shift" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getShiftData();
    }
  }, [pathname]);

  const checks = {
    shiftName: [values.shiftName !== ""],
    startTime: [values.shortName !== null],
    endTime: [values.endTime !== null],
  };

  const errorMessages = {
    shiftName: ["This field required"],
    startTime: ["This field required"],
    endTime: ["This field is required"],
  };

  const getShiftData = async () => {
    await axios
      .get(`${ApiUrl}/employee/Shift/${id}`)
      .then((res) => {
        setValues({
          shiftName: res.data.data.shiftName,
          startTime: dayjs(res.data.data.frontend_use_start_time),
          endTime: dayjs(res.data.data.frontend_use_end_time),
        });
        setShiftId(res.data.data.shiftCategoryId);
        setCrumbs([
          { name: "ShiftMaster", link: "/ShiftMaster" },
          { name: "Shift" },
          { name: "Update" },
          { name: res.data.data.shiftName },
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
      temp.shiftName = values.shiftName;
      temp.frontend_use_start_time = values.startTime;
      temp.frontend_use_end_time = values.endTime;
      temp.shiftStartTime = convertTimeToString(dayjs(values.startTime).$d);
      temp.shiftEndTime = convertTimeToString(dayjs(values.endTime).$d);
      await axios
        .post(`${ApiUrl}/employee/Shift`, temp)
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
          navigate("/ShiftMaster", { replace: true });
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
      temp.shiftCategoryId = shiftId;
      temp.shiftName = values.shiftName;
      temp.frontend_use_start_time = values.startTime;
      temp.frontend_use_end_time = values.endTime;
      temp.shiftStartTime = convertTimeToString(dayjs(values.startTime).$d);
      temp.shiftEndTime = convertTimeToString(dayjs(values.endTime).$d);

      await axios
        .put(`${ApiUrl}/employee/Shift/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/ShiftMaster", { replace: true });
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
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shiftName"
              label="Shift Name"
              value={values.shiftName}
              handleChange={handleChange}
              checks={checks.shiftName}
              errors={errorMessages.shiftName}
              required
              fullWidth
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTimePicker
              name="startTime"
              label="Start time"
              value={values.startTime}
              handleChangeAdvance={handleChangeAdvance}
              seconds
              checks={checks.startTime}
              errors={errorMessages.startTime}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTimePicker
              name="endTime"
              label="End time"
              value={values.endTime}
              handleChangeAdvance={handleChangeAdvance}
              seconds
              checks={checks.endTime}
              errors={errorMessages.endTime}
              required
              disabled={!values.startTime}
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

export default ShiftForm;
