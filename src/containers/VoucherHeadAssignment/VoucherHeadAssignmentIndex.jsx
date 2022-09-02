import { React, useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Link } from "react-router-dom";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../components/ModalWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { Box, Grid, Button, CircularProgress } from "@mui/material";

function VoucherHeadAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [openWrapper, setOpenWrapper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/finance/fetchAllVoucherHeadDetail?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const handleActive = (params) => {
    setModalOpen(true);
    const id = params.row.id;
    const active = () => {
      params.row.active === true
        ? axios
            .delete(`${ApiUrl}/finance/VoucherHeadNew/${id}`)
            .then((Response) => {
              if (Response.status === 200) {
                getData();
                setModalOpen(false);
              }
            })
        : axios
            .delete(`${ApiUrl}/finance/activateVoucherHeadNew/${id}`)
            .then((Response) => {
              if (Response.status === 200) {
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
    axios
      .get(`${ApiUrl}/finance/VoucherHead/${params.row.id}`)
      .then((Response) => {
        setData(Response.data.data);
      });
  };
  const updateOb = async () => {
    // console.log(data);
    // return false;
    await axios
      .put(`${ApiUrl}/finance/VoucherHead/${data.voucher_head_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          getData();
          setOpenWrapper(false);
        }
        if (res.status === 201) {
          // window.location.href = "/VoucherHeadAssignmentIndex";
        }
      })
      .catch((error) => {});
  };
  const handleOb = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const columns = [
    { field: "voucher_head", headerName: "Voucher Head", flex: 1 },
    { field: "ledger_name", headerName: "Ledger", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    { field: "voucher_type", headerName: "Voucher Type", flex: 1 },
    { field: "budget_head", headerName: "Is Budget", flex: 1 },
    { field: "voucher_priority", headerName: "Priority", flex: 1 },
    {
      field: "created_by",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <Link to={`/VoucherHeadAssignmentUpdate/${params.row.id}`}>
            <GridActionsCellItem icon={<EditIcon />} label="Update" />
          </Link>
        );
      },
    },
    { field: "opening_balance", headerName: "OB", flex: 1 },
    {
      field: "created_date",
      headerName: "Update OB",
      renderCell: (params) => {
        return (
          <GridActionsCellItem
            icon={<AddCircleOutlineIcon />}
            label="OB"
            onClick={() => ob(params)}
          />
        );
      },
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
                  label="Enter"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  name="opening_balance"
                  handleChange={handleOb}
                  value={parseInt(data.opening_balance)}
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
                      disabled={loading}
                      onClick={updateOb}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Update</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Box>
      </ModalWrapper>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <GridIndex rows={rows} columns={columns} />
    </>
  );
}
export default VoucherHeadAssignmentIndex;
