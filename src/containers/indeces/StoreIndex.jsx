import { React, useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../components/CustomModal";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { Button, Box } from "@mui/material";
function StoreIndex() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/inventory/fetchAllStoresStockDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        console.log(Response.data.data.Paginated_data.content);
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
        axios.delete(`${ApiUrl}/inventory/StoresStock/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        axios
          .delete(`${ApiUrl}/inventory/activateStoresStock/${id}`)
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
    { field: "stock_type_name", headerName: " Store", flex: 1 },
    { field: "stock_type_short_name", headerName: " Short Name", flex: 1 },
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
        <Link to={`/InventoryMaster/Store/Update/${params.row.id}`}>
          <GridActionsCellItem icon={<EditIcon />} label="Update" />
        </Link>,
      ],
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <GridActionsCellItem
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ) : (
          <GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
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
          disabled={rows.active === false}
          onClick={() => navigate("/InventoryMaster/Store/New")}
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

export default StoreIndex;
