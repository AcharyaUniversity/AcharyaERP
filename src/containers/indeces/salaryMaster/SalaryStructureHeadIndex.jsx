import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Box, IconButton } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ApiUrl from "../../../services/Api";
function SalaryStructureHeadIndex() {
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
        `${ApiUrl}/finance/fetchAllSalaryStructureHeadDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        console.log(res.data.data.Paginated_data.content);
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => {
        console.error(err);
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
          .delete(`${ApiUrl}/finance/SalaryStructureHead/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        axios
          .delete(`${ApiUrl}/finance/activateSalaryStructureHead/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => {
            console.error(err);
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
      field: "voucher_head_short_name",
      headerName: "Salary Structure Head",
      flex: 1,
    },
    {
      field: "category_name_type",
      headerName: "Type",
      flex: 1,
    },
    { field: "print_name", headerName: "Print Name", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },

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
              `/SalaryMaster/SalaryStructureHead/Update/${params.row.id}`
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
          onClick={() => navigate("/SalaryMaster/SalaryStructureHead/New")}
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
export default SalaryStructureHeadIndex;
