import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  styled,
  tableCellClasses,
  TableCell,
  Grid,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
    padding: "5px",
  },
}));

function SyllabusIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSyllabusOpen, setModalSyllabusOpen] = useState(false);
  const [syllabus, setSyllabus] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [courseCode, setCourseCode] = useState(null);

  const navigate = useNavigate();
  const classes = useStyles();

  const columns = [
    { field: "course_name", headerName: "Course Name", flex: 2 },
    { field: "course_code", headerName: "Course Code", flex: 1 },
    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleView(params)}>
          <VisibilityIcon />
        </IconButton>,
      ],
    },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton onClick={() => handleUpdate(params)}>
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
        `/api/academic/fetchAllSyllabusDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        const filtered = res.data.data.filter((obj, index) => {
          return (
            index ===
            res.data.data.findIndex((o) => obj.course_name === o.course_name)
          );
        });

        setAllRows(res.data.data);
        setRows(filtered);
      })
      .catch((err) => console.error(err));
  };

  const handleUpdate = (params) => {
    const allIds = [];
    allRows.filter((obj) => {
      if (
        obj.course_name === params.row.course_name &&
        obj.course_code === params.row.course_code
      ) {
        allIds.push(obj.id);
      }
    });
    navigate(`/CourseSubjectiveMaster/Syllabus/Update/${allIds.toString()}`);
  };

  const handleView = (params) => {
    setModalSyllabusOpen(true);
    const temp = [];

    allRows.filter((val) => {
      if (
        val.course_name === params.row.course_name &&
        val.course_code === params.row.course_code
      ) {
        temp.push(val);
        setCourseCode(val.course_code);
      }

      const reversed = [...temp].reverse();
      setSyllabus(reversed);
    });
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/syllabus/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activatesyllabus/${id}`)
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

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        maxWidth={500}
        maxHeight={500}
        open={modalSyllabusOpen}
        setOpen={setModalSyllabusOpen}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} mt={2}>
            <Typography variant="subtitle2" className={classes.bg}>
              Syllabus - {courseCode}
            </Typography>
          </Grid>
          {syllabus.map((obj, i) => {
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
                        <Typography variant="subtitle2">
                          {"Module" +
                            " " +
                            Number(i + 1) +
                            " " +
                            "-" +
                            " " +
                            `${obj.duration}` +
                            " " +
                            "hrs"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {obj.syllabus_objective}
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/CourseSubjectiveMaster/Syllabus/New")}
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
export default SyllabusIndex;
