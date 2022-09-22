import { useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff } from "@mui/icons-material";
import { Grid, Box, IconButton, Button, ListItemText } from "@mui/material";
import CustomModal from "../../components/CustomModal";
import ModalWrapper from "../../components/ModalWrapper";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CustomTextField from "../../components/Inputs/CustomTextField";

function VoucherAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [openWrapper, setOpenWrapper] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/finance/fetchAllVoucherHeadDetail?page=${0}&page_size=${100}&sort=created_date`
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
        ? axios.delete(`${ApiUrl}/finance/VoucherHead/${id}`).then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
        : axios
            .delete(`${ApiUrl}/finance/activateVoucherHead/${id}`)
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

  const ob = (params) => {
    setOpenWrapper(true);
    axios.get(`${ApiUrl}/finance/VoucherHead/${params.row.id}`).then((res) => {
      setData(res.data.data);
    });
  };

  const handleOb = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateOb = async () => {
    await axios
      .put(`${ApiUrl}/finance/VoucherHead/${data.voucher_head_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          getData();
          setOpenWrapper(false);
        }
      })
      .catch((error) => {});
  };

  const columns = [
    {
      field: "voucher_head",
      headerName: "Voucher Head",
      flex: 1,
      hideable: false,
    },
    { field: "ledger_name", headerName: "Ledger", flex: 1, hideable: false },
    {
      field: "school_name_short",
      headerName: "School",
      flex: 1,
      hideable: false,
    },
    {
      field: "voucher_type",
      headerName: "Voucher Type",
      flex: 1,
      hideable: false,
    },
    { field: "budget_head", headerName: "Is Budget", flex: 1, hide: true },
    { field: "cash_or_bank", headerName: "Cash / Bank", flex: 1, hide: true },
    { field: "salaries", headerName: "Is Salaries", flex: 1, hide: true },
    { field: "voucher_priority", headerName: "Priority", flex: 1, hide: true },
    { field: "is_common", headerName: "Is Common", flex: 1, hide: true },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    { field: "opening_balance", headerName: "OB", flex: 1 },
    {
      field: "modified_date",
      headerName: "Update OB",
      renderCell: (params) => {
        return (
          <IconButton label="OB" onClick={() => ob(params)}>
            <AddCircleOutlineIcon />
          </IconButton>
        );
      },
    },
    {
      field: "created_by",
      hideable: false,
      headerName: "Update",
      renderCell: (params) => {
        return (
          <IconButton
            label="Update"
            onClick={() =>
              navigate(
                `/AccountMaster/VoucherAssignment/Update/${params.row.id}`
              )
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
            onClick={() => {
              handleActive(params);
            }}
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
      <ModalWrapper
        open={openWrapper}
        title="Update OB"
        maxWidth={500}
        setOpen={setOpenWrapper}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={8}>
                <CustomTextField
                  label="Amount"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  name="opening_balance"
                  handleChange={handleOb}
                  value={
                    data.opening_balance ? parseInt(data.opening_balance) : 0
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                  rowSpacing={2}
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      onClick={updateOb}
                    >
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Button
          onClick={() => navigate("/AccountMaster/VoucherAssignment/New")}
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
export default VoucherAssignmentIndex;
