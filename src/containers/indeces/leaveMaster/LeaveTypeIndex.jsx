import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import moment from "moment";

function LeaveTypeIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "leave_type", headerName: "Leave", flex: 1, hideable: false },
    {
      field: "leave_type_short",
      headerName: " Short Name",
      flex: 1,
      hideable: false,
    },
    { field: "type", headerName: "Type", flex: 1, hideable: false },
    {
      field: "is_attendance",
      headerName: "Leave Kitty",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) => (row.is_attendance ? "Yes" : "No"),
    },
    {
      field: "leave_type_attachment_required",
      headerName: "Attachment Required",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) =>
        row.leave_type_attachment_required ? "Yes" : "No",
    },
    {
      field: "hr_initialization_status",
      headerName: "HR Status",
      flex: 1,
      hideable: false,
      valueGetter: (value, row) =>
        row.hr_initialization_status ? "Yes" : "No",
    },
    { field: "remarks", headerName: "Remarks", flex: 1, hideable: false },

    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
     // type: "date",
       valueGetter: (value, row) =>
        moment(row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() =>
            navigate(`/LeaveMaster/LeaveTypes/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>
      ),
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
        `/api/fetchAllLeaveTypeDetails?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/LeaveType/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateLeaveType/${id}`)
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

      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/LeaveMaster/LeaveTypes/New")}
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
export default LeaveTypeIndex;
