import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

function CourseAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const columns = [
    { field: "username", headerName: "Faculty", flex: 1 },
    { field: "course_short_name", headerName: "Course", flex: 1 },
    { field: "course_code", headerName: "Course Code", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (value, row) =>
        row.program_short_name +
        "-" +
        row.program_specialization_short_name,
    },
    { field: "ac_year", headerName: "Ac Year", flex: 1 },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    { field: "empcode", headerName: "Empcode", flex: 1 },
    { field: "duration", headerName: "Vtu Max Hours", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "createdUsername", headerName: "Created By", flex: 1 },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/TimeTableMaster/CourseAssignment/Update/${params.row.id}`
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

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllSubjectAssignment?page=${0}&page_size=${1000000}&sort=createdDate`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getData();
    if (pathname.toLowerCase() === "/courseassignmentindex") {
      setCrumbs([{ name: "Course Assignment" }]);
    }
  }, []);

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/academic/SubjectAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/academic/activateSubjectAssignment/${id}`)
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
        message: "Do you want to make it Inactive?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
        ],
      })
      : setModalContent({
        title: "",
        message: "Do you want to make it Active?",
        buttons: [
          { name: "Yes", color: "primary", func: handleToggle },
          { name: "No", color: "primary", func: () => { } },
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
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/TimeTableMaster/CourseAssignment/New")}
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
export default CourseAssignmentIndex;
