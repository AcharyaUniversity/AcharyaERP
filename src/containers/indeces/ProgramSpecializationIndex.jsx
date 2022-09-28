import { React, useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Box, IconButton } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiUrl from "../../services/Api";
function ProgramSpecializationIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/academic/fetchAllProgramSpecilizationDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios
          .delete(`${ApiUrl}/academic/ProgramSpecilization/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          });
      } else {
        axios
          .delete(`${ApiUrl}/academic/activateProgramSpecilization/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          });
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
  };
  const columns = [
    {
      field: "program_specialization_name",
      headerName: "Program Specialization",
      flex: 1,
    },
    {
      field: "program_specialization_short_name",
      headerName: "Short Name",
      flex: 1,
    },
    { field: "auid_format", headerName: "AUID", flex: 1 },
    { field: "ac_year", headerName: "Academic Year", flex: 1 },

    {
      field: "school_name",
      headerName: "School",
      flex: 1,
    },
    {
      field: "program_name",
      headerName: "Program",
      flex: 1,
    },
    {
      field: "dept_name",
      headerName: "Department",
      flex: 1,
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
        <IconButton
          onClick={() =>
            navigate(
              `/AcademicMaster/ProgramSpecialization/Update/${params.row.id}`
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
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Button
          onClick={() => navigate("/AcademicMaster/ProgramSpecialization/New")}
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
export default ProgramSpecializationIndex;
