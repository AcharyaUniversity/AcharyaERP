import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Grid,
  TableCell,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "5px",
  },
}));

const initialValues = {
  acYearId: 1,
  courseId: null,
  employeeId: null,
};

function TimetableForSectionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalSelectContent, setModalSelectContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelectOpen, setModalSelectOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [previousEmployeeId, setPreviousEmployeeId] = useState(null);
  const [timeTableId, setTimeTableId] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  const columns = [
    {
      field: "ac_year",
      headerName: "AC Year",
      flex: 1,
    },

    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_specialization_short_name
          ? params.row.program_specialization_short_name
          : "NA",
    },
    {
      field: "",
      headerName: "Yr/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year
          ? params.row.current_year
          : params.row.current_sem,
    },

    {
      field: "week_day",
      headerName: "Day",
      flex: 1,
      valueGetter: (params) =>
        params.row.week_day ? params.row.week_day.slice(0, 3) : "",
    },
    { field: "timeSlots", headerName: "Time Slot", flex: 1 },
    {
      field: "interval_type_short",
      headerName: "Interval Type",
      flex: 1,
      hide: true,
    },

    { field: "course_short_name", headerName: "Course", flex: 1 },
    {
      field: "selected_date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.selected_date
          ? params.row.selected_date.split("-").reverse().join("-")
          : "",
    },
    { field: "roomcode", headerName: "Room Code", flex: 1 },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
      valueGetter: (params) =>
        params.row.section_name ? params.row.section_name : "NA",
    },
    {
      field: "batch_name",
      headerName: "Batch",
      flex: 1,
      valueGetter: (params) =>
        params.row.batch_name ? params.row.batch_name : "NA",
    },

    {
      field: "view",
      headerName: "Employee",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleEmployees(params)} color="primary">
          <AssignmentIndIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) =>
        params.row.created_date ? params.row.created_date.slice(0, 10) : "",
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
    getAcYearData();
    getCourseData();
  }, [values.acYearId, values.employeeId]);

  const getAcYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getData = async () => {
    if (values.acYearId)
      await axios
        .get(
          `/api/academic/fetchAllTimeTableDetailsForIndex/${values.acYearId}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIds(selectedRowsData.map((val) => val.id));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleActive = async (params) => {
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/deactivateTimeTableEmployee/${ids.toString()}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateTimeTableEmployee/${ids.toString()}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleSelectOpen = () => {
    const handleSectionCreation = () => {
      navigate("/TimetableMaster/Timetable/Section/New");
    };

    const handleBatchCreation = () => {
      navigate("/TimetableMaster/Timetable/Batch/New");
    };

    setModalSelectOpen(true);
    setModalSelectContent({
      title: "Create Timetable For",
      message: "",
      buttons: [
        { name: "Section", color: "primary", func: handleSectionCreation },
        { name: "Batch", color: "primary", func: handleBatchCreation },
      ],
    });
  };

  const handleEmployees = async (params) => {
    setTimeTableId(params.row.id);
    setEmployeeOpen(true);
    await axios
      .get(
        `/api/academic/timeTableEmployeeDetailsOnTimeTableId/${params.row.time_table_id}`
      )
      .then((res) => {
        setPreviousEmployeeId(res.data.data[0].emp_id);
        setEmployeeData(res.data.data);
        axios
          .get(
            `/api/employee/getEmployeesUnderDepartment/${res.data.data[0].emp_id}/${params.row.selected_date}/${params.row.time_slots_id}`
          )
          .then((res) => {
            setEmployeeOptions(
              res.data.data.map((obj) => ({
                value: obj.emp_id,
                label: obj.employeeName,
              }))
            );
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const getCourseData = async () => {
    if (values.employeeId)
      await axios
        .get(`/api/academic/getAssignedCourses/${values.employeeId}`)
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
              label: obj.course_name_with_code,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    await axios
      .put(
        `/api/academic/updateEmployeeIdForSwapping/${timeTableId}/${previousEmployeeId}/${values.employeeId}/${values.courseId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Swapped" });
          setAlertOpen(true);
          setEmployeeOpen(false);
          handleEmployees();
        } else {
          setAlertMessage({ severity: "error", message: "Error" });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <CustomModal
        open={modalSelectOpen}
        setOpen={setModalSelectOpen}
        title={modalSelectContent.title}
        message={modalSelectContent.message}
        buttons={modalSelectContent.buttons}
      />
      <Box>
        <FormWrapper>
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={4}
          >
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acYearId"
                value={values.acYearId}
                label="Academic Year"
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={10} textAlign="right">
              <Button
                onClick={handleSelectOpen}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <GridIndex
                rows={rows}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
              />
            </Grid>
          </Grid>
        </FormWrapper>
        <ModalWrapper
          maxWidth={1200}
          open={employeeOpen}
          setOpen={setEmployeeOpen}
        >
          <Grid container justifyContent="flex-start">
            <Grid item xs={12} md={12} mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead className={classes.bg}>
                    <TableRow>
                      <TableCell sx={{ color: "white", width: 100 }}>
                        Employee
                      </TableCell>
                      <TableCell sx={{ color: "white", width: 100 }}>
                        Code
                      </TableCell>
                      <TableCell sx={{ color: "white", width: 100 }}>
                        Staff Mapped
                      </TableCell>
                      <TableCell sx={{ color: "white", width: 100 }}>
                        Course
                      </TableCell>
                      <TableCell sx={{ color: "white", width: 100 }}>
                        Swap
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeeData.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{obj.employee_name}</TableCell>
                          <TableCell>{obj.empcode}</TableCell>
                          <TableCell>
                            <CustomAutocomplete
                              name="employeeId"
                              label=""
                              value={values.employeeId}
                              options={employeeOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <CustomAutocomplete
                              name="courseId"
                              label=""
                              value={values.courseId}
                              options={courseOptions}
                              handleChangeAdvance={handleChangeAdvance}
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              sx={{ borderRadius: 2 }}
                              onClick={handleSubmit}
                            >
                              SWAP
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}
export default TimetableForSectionIndex;
