import { useState, useEffect } from "react";
import { Box, Button, IconButton } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";

function ApproverIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const columns = [
    { field: "username", headerName: "Approver", flex: 1 },
    {
      field: "food_approver",
      headerName: "Food Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.food_approver === true ? "Yes" : "No",
    },
    {
      field: "travel_approver",
      headerName: "Travel Indent Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.travel_approver === true ? "Yes" : "No",
    },
    {
      field: "bill_approver",
      headerName: "Bill Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.bill_approver === true ? "Yes" : "No",
    },
    {
      field: "purchase_approver",
      headerName: "Purchase Approver",
      flex: 1,
      valueGetter: (params) =>
        params.row.purchase_approver === true ? "Yes" : "No",
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) =>
        params.row.created_date
          ? params.row.created_date.slice(0, 10).split("-").reverse().join("-")
          : "Na",
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() => navigate(`/Approver/Update/${params.row.id}`)}
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
        `/api/fetchAllApproverCreation?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/deactivateApproverCreation/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/activateApproverCreation/${id}`)
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
          disabled={rows.active === false}
          onClick={() => navigate("/ApproverCreation")}
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

export default ApproverIndex;
