import { useState, useEffect } from "react";
import { Box, Button, IconButton, Grid } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
  },
}));

function CourseObjectiveIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [courseObjective, setCourseObjective] = useState([]);
  const [modalObjectiveOpen, setModalObjectiveOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [allData, setAllData] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();

  const columns = [
    // { field: "course_objective", headerName: "Course Objective", flex: 1 },
    { field: "course_name", headerName: "Course", flex: 2 },
    {
      field: "course_code",
      headerName: "Course Code",
      flex: 1,
    },
    {
      field: "view",
      headerName: "Objective",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleView(params)}>
          <VisibilityIcon />
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
      valueGetter: (params) => new Date(params.row.created_date),
      hide: true,
    },

    {
      field: "id",
      type: "actions",
      flex: 0.5,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/CourseSubjectiveMaster/CourseObjective/Update/${params.row.id}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
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
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllCourseObjectiveDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setAllData(res.data.data.Paginated_data.content);
        const filtered = res.data.data.Paginated_data.content.filter(
          (obj, i) => {
            return (
              i ===
              res.data.data.Paginated_data.content.findIndex(
                (item) => item.course_id === obj.course_id
              )
            );
          }
        );
        setRows(filtered);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/courseObjective/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateCourseObjective/${id}`)
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
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleView = (params) => {
    setModalObjectiveOpen(true);
    const temp = [];
    allData.filter((obj) => {
      if (obj.course_id === params.row.course_id) {
        setCourseCode(obj.course_code);
        temp.push(obj);
      }
    });
    setCourseObjective(temp);
  };

  return (
    <>
      <ModalWrapper
        maxWidth={500}
        maxHeight={500}
        open={modalObjectiveOpen}
        setOpen={setModalObjectiveOpen}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle2" className={classes.bg}>
              Objective - {courseCode}
            </Typography>
          </Grid>
          {courseObjective.map((obj, i) => {
            return (
              <Grid item xs={12} md={12} key={i}>
                <Card elevation={4}>
                  <CardContent>
                    <Grid
                      container
                      justifyContent="flex-start"
                      rowSpacing={0.5}
                      columnSpacing={2}
                    >
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {obj.course_objective}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() =>
            navigate("/CourseSubjectiveMaster/CourseObjective/New")
          }
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default CourseObjectiveIndex;
