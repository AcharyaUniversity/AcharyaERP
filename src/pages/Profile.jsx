import { useEffect } from "react";
import { Paper, Box, Typography, Grid } from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { makeStyles } from "@mui/styles";
import profileImage from "../assets/Profile.jpg";
import background from "../assets/ProfileBackground.jpg";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import EmployeeProfileDetails from "../components/EmployeeProfileDetails";

const useStyles = makeStyles((theme) => ({
  backgroundImage: {
    position: "fixed",
    width: "100vw",
    zIndex: 0,
  },
  container: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 7,
    padding: 10,
  },
  card: {
    borderRadius: "11px !important",
    overflow: "hidden",
    backgroundColor: "#e1e5fa99 !important",
    backdropFilter: "blur(47px)",
    height: "100%",
  },
  cardHeader: {
    backgroundColor: theme.palette.blue.main,
    color: "white",
    padding: "5px 10px",
  },
  leftTab: {
    width: 100,
  },
}));

function Profile() {
  const classes = useStyles();

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([]), []);

  return (
    <Box>
      <img src={background} className={classes.backgroundImage} />
      <Grid
        container
        className={classes.container}
        columnSpacing={2}
        rowSpacing={2}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} className={classes.card} fontSize="1rem" pb={2}>
            <Box
              sx={{
                backgroundImage: `url(${profileImage})`,
                width: "100%",
                height: 275,
                backgroundSize: "100%",
                backgroundPosition: "center top",
                mb: 1,
              }}
            />
            <Box px={1}>
              <Typography variant="h4" component="h4">
                Ashna
              </Typography>
              <Typography variant="h6" component="h6">
                AI00023
              </Typography>
              <Typography variant="p" component="p" my={0.5}>
                Designation: <span style={{ fontWeight: 500 }}>Tech Lead</span>
              </Typography>
              <Typography variant="p" component="p" my={0.5}>
                Department: <span style={{ fontWeight: 500 }}>ERP</span>
              </Typography>
              <Typography variant="p" component="p" my={0.5}>
                Institute:{" "}
                <span style={{ fontWeight: 500 }}>
                  Acharya Institute of Health Sciences
                </span>
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={4} className={classes.card} fontSize="1rem">
            <Typography
              component="h6"
              variant="h6"
              className={classes.cardHeader}
            >
              Contact
            </Typography>
            <Box p={1}>
              <Typography component="h6" variant="h6">
                Address
              </Typography>
              <Typography component="p" variant="p" mb={2}>
                #232, 4th cross, 2nd main, 6th block, shivajinagar, bangalore
              </Typography>
              <Typography component="h6" variant="h6">
                Phone number
              </Typography>
              <Typography component="p" variant="p" mb={2}>
                +91 2323454587
              </Typography>
              <Typography component="h6" variant="h6">
                Email address
              </Typography>
              <Typography component="p" variant="p" mb={2}>
                example.email@acharya.ac.in
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <Paper elevation={4} className={classes.card} fontSize="1rem">
            <Typography
              component="h6"
              variant="h6"
              className={classes.cardHeader}
            >
              Expereince
            </Typography>
            <Box mx={1} mt={1}>
              <Typography component="h6" variant="h6">
                Skills
              </Typography>
              <Typography component="p" variant="p" mb={2}>
                Javascript, React, Typescript, Node, Mongo
              </Typography>
            </Box>

            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              <TimelineItem>
                <TimelineOppositeContent fontWeight={500}>
                  2021
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="blue" />
                  <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography component="p" variant="p" fontWeight={600}>
                    Tech Lead
                  </Typography>
                  <Typography component="p" variant="p" fontSize="0.8rem">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Qui nesciunt nostrum similique enim exercitationem animi
                    molestias explicabo, hic aut quas.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent fontWeight={500}>
                  2018
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="blue" />
                  {/* <TimelineConnector sx={{ bgcolor: "blue.main" }} /> */}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography component="p" variant="p" fontWeight={600}>
                    Frontend Developer
                  </Typography>
                  <Typography component="p" variant="p" fontSize="0.8rem">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Officia illo alias sint? Optio laborum minima dignissimos
                    suscipit illum corporis molestiae.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Paper>
        </Grid>

        <Grid item xs={12} mb={5}>
          <Paper
            sx={{
              background: "#ccd4ff",
            }}
            elevation={4}
            className={classes.card}
            p={1}
          >
            <EmployeeProfileDetails />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;
