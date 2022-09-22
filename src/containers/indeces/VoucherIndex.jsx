import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import { Box, IconButton, Button } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

function VoucherIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/finance/fetchAllVoucherHeadNewDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      });
  };

  const handleActive = (params) => {
    setModalOpen(true);
    const id = params.row.id;
    const active = () => {
      params.row.active === true
        ? axios.delete(`${ApiUrl}/finance/VoucherHeadNew/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
        : axios
            .delete(`${ApiUrl}/finance/activateVoucherHeadNew/${id}`)
            .then((res) => {
              if (res.status === 200) {
                getData();
                setModalOpen(false);
              }
            });
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const columns = [
    { field: "voucher_head", headerName: "Voucher Head", flex: 1 },
    { field: "voucher_head_short_name", headerName: "Short Name", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "count",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <IconButton
            label="Update"
            onClick={() =>
              navigate(`/AccountMaster/Voucher/Update/${params.row.id}`)
            }
          >
            <EditIcon />
          </IconButton>
        );
      },
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
        <Button
          onClick={() => navigate("/AccountMaster/Voucher/New")}
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
export default VoucherIndex;
