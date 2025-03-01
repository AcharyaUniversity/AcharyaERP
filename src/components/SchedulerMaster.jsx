import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../services/Api";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { customColors } from "../services/Constants";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import useAlert from "../hooks/useAlert";

const mLocalizer = momentLocalizer(moment);

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;
const roleName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleName;
const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const boxStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
};

const switchList = [
  { label: "Holidays", value: "holiday", isChecked: true },
  { label: "Time Table", value: "timetable", isChecked: true },
  { label: "Daily Plans", value: "dailyPlan", isChecked: true },
];

function SchedulerMaster({
  localizer = mLocalizer,
  showDemoLink = true,
  selectedEmpId,
  ...props
}) {
  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [switchData, setSwitchData] = useState(switchList);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getEvents();
    setCrumbs([]);
  }, [selectedEmpId]);

  useEffect(() => {
    handleEvents();
  }, [switchData, events]);

  const combineDateAndTime = (selectedDate, startingTime) => {
    if (startingTime) {
      // Check if startingTime is not null or undefined
      const date = new Date(selectedDate);
      const [time, period] = startingTime?.split(" ");
      let [hours, minutes] = time?.split(":");

      if (period === "PM" && parseInt(hours, 10) < 12) {
        hours = String(parseInt(hours, 10) + 12);
      }

      date.setHours(hours);
      date.setMinutes(minutes);

      return date;
    }
  };

  const getRandomColor = () => {
    // const letters = "0123456789ABCDEF";
    // let color = "#";
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }
    // return color;
    const randomIndex = Math.floor(Math.random() * customColors.length);
    return customColors[randomIndex];
  };

  const getEvents = async (date = new Date()) => {
    try {
      setLoading(true);
      let id;
      let url = "api/academic/timeTableDetailsOfStudentOrEmployeeForMobile?";
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      if (roleName === "Student") {
        const { data: response } = await axios.get(
          `/api/student/getStudentDetailsByAuid/${userName}`
        );
        const responseData = response.data;
        id = responseData.student_id;
        url = `${url}student_id=${id}&year=${year}&month=${month}`;
      } else {
        const { data: response } = await axios.get(
          `/api/employee/getEmployeeDataByUserID/${userId}`
        );
        const responseData = response.data;
        id = responseData.emp_id;
        if (selectedEmpId) {
          id = selectedEmpId;
        }
        url = `${url}year=${year}&employee_id=${id}&month=${month}`;
      }

      const ttResponse = await axios.get(url);
      let ttResponseData = ttResponse.data.data.flat();
      if (roleName === "Student") {
        ttResponseData = ttResponseData.filter(
          (obj) => obj.leave_type_short !== "RH"
        );
      }
      const timeTableData = [];
      ttResponseData.forEach((obj) => {
        const {
          timeSlots,
          time_slots_id: time_slots_id,
          current_sem: current_sem,
          current_year: current_year,
          program_id: programId,
          is_online: offline_status,
          program_specialization_id: programSpecializationId,
          ac_year_id: acYearId,
          school_id: schoolID,
          section_id: secID,
          batch_id: batch_id,
          course_assignment_id: course_assignment_id,
          date_of_class: dateOfClass,
          from_date: fromDate,
          start_time: startTime,
          end_time: endTime,
          interval_type_short: intervalType,
          time_table_id: timeTableId,
          course_id: courseId,
          holiday_calendar_id: holidayId,
          holiday_name: holiday,
          holiday_description: holidayDescription,
          present_status: presentStatus,
          course_short_name: courseName,
          course_code: code,
          employee_name: faculty,
          roomcode,
          is_online: mode,
          interval_type_name: intervalFullName,
          leave_type: leaveType,
          commencement_type: commencementType,
          attendance_status: attendanceStatus,
          emp_id: empId,
          section_assignment_id: sectionAssignmentId,
          batch_assignment_id,
        } = obj;
        let date, title, start, end, type, description;
        if (timeTableId) {
          date = dateOfClass;
          title = `${intervalType} ${timeSlots}`;
          start = combineDateAndTime(date, startTime);
          end = combineDateAndTime(date, endTime);
          type = "timetable";
        } else if (holidayId || commencementType) {
          date = fromDate;
          title = holidayId ? `${holiday} - ${leaveType}` : commencementType;
          start = end = new Date(fromDate);
          type = holidayId ? "holiday" : "commencement";
          description = holidayDescription;
        }

        if (timeTableId || holidayId || commencementType) {
          const tempObj = {
            acYearId,
            programId,
            programSpecializationId,
            courseId,
            current_sem,
            current_year,
            start,
            end,
            course_assignment_id,
            title,
            bgColor: type === "holiday" ? "#FF7F7F" : getRandomColor(),
            type,
            description,
            presentStatus,
            courseName,
            code,
            faculty,
            roomcode,
            schoolID,
            batch_id,
            offline_status,
            secID,
            time_slots_id,
            mode,
            date,
            intervalFullName,
            attendanceStatus,
            id: timeTableId,
            empId,
            sectionAssignmentId,
            batch_assignment_id,
          };
          timeTableData.push(tempObj);
        }
      });

      if (roleName !== "Student") {
        const [response, attendanceResponse, internalResponse] =
          await Promise.all([
            axios.get(`/api/getAllActiveDailyPlannerBasedOnEmpId/${id}`),
            axios.get(
              `/api/employee/getAttendanceOfEmployeeByEmployeeId/${id}/${year}-${month}/${year}-${month}}`
            ),
            axios.get(
              `/api/academic/internalTimeTableAssignmentDetailsByEmployeeId/${id}`
            ),
          ]);
        const dailyPlanData = response.data.data;
        const attendanceResponseData = attendanceResponse.data.data;
        const internalResponseData = internalResponse.data.data;
        dailyPlanData.forEach((obj) => {
          const {
            from_date: fromDate,
            to_date: toDate,
            type,
            task_title: taskTitle,
            task_type: taskType,
          } = obj;
          const start = moment(fromDate, "DD-MM-YYYY HH:mm").toDate();
          const end = moment(toDate, "DD-MM-YYYY HH:mm").toDate();
          let title;
          if (type === null) {
            title = taskTitle;
          } else if (type === "Personal") {
            title = taskTitle;
          } else {
            title = taskType;
          }
          const tempObj = {
            id: `daily_task_${obj.id}`,
            start,
            end,
            title,
            bgColor: getRandomColor(),
            type: "dailyPlan",
          };
          timeTableData.push(tempObj);
        });
        // attendance
        if (attendanceResponseData.length > 0) {
          const attendanceData = attendanceResponseData[0];
          for (let day = 1; day <= 31; day++) {
            if (attendanceData[`day${day}`]) {
              const attObj = {
                id: `att_day${day}_${month}_${year}`,
                status: attendanceData[`day${day}`],
                type: "attendence",
                date: moment(`${day}-${month}-${year}`, "DD-MM-YYYY"),
              };
              timeTableData.push(attObj);
            }
          }
        }
        // Internals
        if (internalResponseData.length > 0) {
          internalResponseData.forEach((obj) => {
            const {
              id,
              date_of_exam: date,
              internal_short_name: internals,
              timeSlots,
              student_ids,
              course_assignment_id,
              course_id,
              emp_ids,
              date_of_exam,
              room_id,
              exam_time,
              internal_time_table_id,
              present,
              remarks,
              student_id,
              week_day,
              internal_name,
              course_with_coursecode,
              internal_session_id,
              concatenated_internal_student_assignment_id: stdAssignmentids,
            } = obj;
            const start = moment(date, "DD-MM-YYYY HH:mm").toDate();

            const tempObj = {
              id,
              start,
              end: start,
              title: ` ${internals} ${timeSlots}`,
              bgColor: getRandomColor(),
              type: "internals",
              student_ids,
              course_assignment_id,
              course_id,
              emp_ids,
              date_of_exam,
              room_id,
              exam_time,
              internal_id: internal_session_id,
              internal_time_table_id,
              present,
              remarks,
              student_id,
              week_day,
              internal_name,
              course_with_coursecode,
              timeSlots,
              stdAssignmentids,
            };
            timeTableData.push(tempObj);
          });
        }
      }
      setEvents(timeTableData);
      setDisplayEvents(timeTableData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const CustomAttendanceStatus = ({ label, color }) => (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircleIcon color={color} sx={{ fontSize: 18 }} />
      <Typography
        variant="subtitle2"
        sx={{ position: "absolute", color: "white", marginTop: "2px" }}
      >
        {label}
      </Typography>
    </Box>
  );

  const customStudentEvent = (event) => {
    const { title, presentStatus } = event;
    let label;
    let color;
    if (presentStatus === true) {
      label = "P";
      color = "success";
    } else if (presentStatus === false) {
      label = "A";
      color = "error";
    }
    return (
      <Box sx={boxStyle}>
        <Typography variant="subtitle2">{title}</Typography>
        {(presentStatus === true || presentStatus === false) && (
          <CustomAttendanceStatus title={title} label={label} color={color} />
        )}
      </Box>
    );
  };

  const customEmpEvent = (event) => {
    const { title, attendanceStatus, type } = event;
    const iconColor =
      attendanceStatus === 1 || attendanceStatus === true ? "success" : "error";
    return (
      <Box sx={boxStyle}>
        <Typography variant="subtitle2">{title}</Typography>
        {type === "timetable" && attendanceStatus === 1 ? (
          <CheckCircleIcon color={iconColor} sx={{ fontSize: 18 }} />
        ) : type === "timetable" && attendanceStatus !== 1 ? (
          <CancelIcon color={iconColor} sx={{ fontSize: 18 }} />
        ) : (
          ""
        )}
      </Box>
    );
  };

  const CustomEvent = ({ event }) =>
    roleName === "Student" ? customStudentEvent(event) : customEmpEvent(event);

  const DisplayDay = ({ status, label, color, bg }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        marginBottom: "4px",
      }}
    >
      <Typography variant="subtitle2" sx={{ color }}>
        {status}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: "white",
          backgroundColor: bg,
          borderRadius: "50%",
          padding: "2px 5px 2px 5px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  const { components, views } = useMemo(
    () => ({
      components: {
        month: {
          dateHeader: ({ date, label }) => {
            const attendenceList = events.filter(
              (obj) => obj.type === "attendence"
            );
            const formattedDate = moment(date).format("YYYY-MM-DD");
            let obj = attendenceList.find((event) =>
              moment(formattedDate).isSame(event.date)
            );
            if (obj && (obj.status === "P" || obj.status === "MA")) {
              return (
                <DisplayDay
                  status={obj.status}
                  label={label}
                  color="green"
                  bg="#00c04b"
                />
              );
            }
            if (obj && (obj.status === "A" || obj.status === "p/a")) {
              return (
                <DisplayDay
                  status={obj.status}
                  label={label}
                  color="#FF7F7F"
                  bg="#FF7F7F"
                />
              );
            }
            if (obj) {
              return (
                <DisplayDay
                  status={obj.status}
                  label={label}
                  color="#1c96c5"
                  bg="#1c96c5"
                />
              );
            }
            return <Typography variant="subtitle2">{label}</Typography>;
          },
        },
        event: CustomEvent,
      },
      views: ["month", "week", "day", "agenda"],
    }),
    [events]
  );

  const handleNavigate = (date, view, action) => {
    if (action) {
      getEvents(date);
    }
  };

  const handleOpen = () => setWrapperOpen(true);

  const handleClose = () => setWrapperOpen(false);

  const todaysDate = moment(new Date()).format("YYYY-MM-DD");

  const handleSelectEvent = useCallback((event) => {
    const { type, description, date, attendanceStatus } = event;
    if (!type && !description) return;

    if (
      type === "timetable" &&
      roleName !== "Student" &&
      roleName === "Super Admin"
    ) {
      navigate("/FacultyDetails", {
        state: { eventDetails: event },
      });
      return;
    }

    if (type === "timetable" && roleName !== "Student" && date === todaysDate) {
      navigate("/FacultyDetails", {
        state: { eventDetails: event },
      });
      return;
    }

    if (
      type === "timetable" &&
      roleName !== "Student" &&
      date !== todaysDate &&
      attendanceStatus === 1
    ) {
      navigate("/FacultyDetails", {
        state: { eventDetails: event },
      });
      return;
    }

    if (type === "timetable" && roleName !== "Student" && date !== todaysDate) {
      setAlertMessage({
        severity: "error",
        message: "Attendance Date Is Locked !!!",
      });
      setAlertOpen(true);
      return;
    }

    if (type === "internals" && roleName !== "Student") {
      navigate("/internal-attendance", {
        state: { eventDetails: event },
      });
      return;
    }
    setSelectedEvent(event);
    handleOpen();
  }, []);

  const handleEventProperty = (event) => {
    return {
      style: {
        backgroundColor: event.bgColor,
        // color: "#b96b6b",
        color: "white",
        fontSize: "12px",
      },
    };
  };

  const handleEvents = () => {
    if (switchData.length === 0 || events.length === 0) return;
    const groupedResult = events.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});
    // const groupedResult = Object.groupBy(events, ({ type }) => type);
    const { holiday, timetable, dailyPlan, ...remainingData } = groupedResult;
    const results = [];
    Object.keys(remainingData).forEach((obj) => {
      results.push(...remainingData[obj]);
    });
    switchData.forEach((obj) => {
      if (obj.isChecked && obj.value in groupedResult) {
        results.push(...groupedResult[obj.value]);
      }
    });
    setDisplayEvents(results);
  };

  const handleSwitchChange = (index) => {
    const updatedData = [...switchData];
    updatedData[index].isChecked = !updatedData[index].isChecked;
    setSwitchData(updatedData);
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };
  const ClassDetails = () => {
    const { courseName, code, faculty, roomcode, mode, date } = selectedEvent;
    return (
      <Grid container rowSpacing={0.5}>
        <DisplayContent
          label="Class Date"
          value={moment(date).format("DD-MM-YYYY")}
        />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Course" value={`${courseName} - ${code}`} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Faculty" value={faculty} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent label="Room Code" value={roomcode} />
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <DisplayContent
          label="Mode of Class"
          value={mode ? "Online" : "Offline"}
        />
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={wrapperOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "100%",
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="subtitle2"
            component="span"
            sx={{ fontSize: 14 }}
          >
            {selectedEvent.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedEvent.type === "timetable" ? (
            <ClassDetails />
          ) : (
            <Typography sx={{ color: "#00000099" }}>
              {selectedEvent.description}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {roleName !== "Student" && (
        <Box sx={{ display: "flex", gap: 1 }}>
          {switchData.map((obj, i) => (
            <Box
              key={i + 1}
              onClick={() => handleSwitchChange(i)}
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              {obj.isChecked ? (
                <ToggleOnIcon
                  sx={{
                    fontSize: 40,
                    color: obj.isChecked ? "primary.main" : "#e6e6e6",
                  }}
                />
              ) : (
                <ToggleOffIcon
                  sx={{
                    fontSize: 40,
                    color: obj.isChecked ? "primary.main" : "#e6e6e6",
                  }}
                />
              )}

              <Typography variant="subtitle2" color="textSecondary">
                {obj.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <div
        style={{
          height: "85vh",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          borderRadius: "10px",
          padding: "20px",
        }}
        {...props}
      >
        <Calendar
          components={components}
          events={displayEvents}
          views={views}
          eventPropGetter={(e) => handleEventProperty(e)}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          localizer={localizer}
          showMultiDayTimes
          startAccessor="start"
          endAccessor="end"
          step={60}
        />
      </div>
    </>
  );
}

export default SchedulerMaster;
