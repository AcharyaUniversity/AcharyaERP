import { useEffect, useRef } from "react";
import { Box, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
//Fullcalendar and Realted Plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed

const useStyles = makeStyles(() => ({
  box: {
    width: "1100px",
    marginLeft: "85px",
    fontFamily: "sans-serif",
    fontSize: 12,
  },
}));

function App() {
  const calendarRef = useRef(null);
  const classes = useStyles();
  const { date } = useParams();

  useEffect(() => {
    handleGoto();
  }, []);

  const handleClick = (id) => {
    console.log(id.event.id);
    console.log(id.event._def.extendedProps.timeSlotid);
    console.log(id.event._def.extendedProps.intervalId);
  };

  const handleGoto = () => {
    if (date) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1} className={classes.box}>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
      >
        <Grid item xs={12} md={12}>
          <FullCalendar
            ref={calendarRef}
            height="100vh"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            defaultView="month"
            eventClick={(arg) => handleClick(arg)}
            events={[
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },

              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },

              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },

              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-14",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-14",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-12",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-13",
              },
              {
                id: 1,
                timeSlotid: 2,
                intervalId: 3,
                title: "09:55AM-10:00AM  (BCA) ",
                date: "2023-04-14",
              },
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
