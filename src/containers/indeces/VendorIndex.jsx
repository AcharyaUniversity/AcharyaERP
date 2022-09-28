import { useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import {
  Box,
  Grid,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import CustomModal from "../../components/CustomModal";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../components/ModalWrapper";
import ApiUrl from "../../services/Api";
import { makeStyles } from "@mui/styles";
import useAlert from "../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    maxWidth: 200,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const styles = makeStyles((theme) => ({
  table: {
    maxWidth: 650,
  },
  tableContainer: {
    borderRadius: 25,
    margin: "10px 10px",
    maxWidth: 400,
  },
}));
function VendorIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const classes = styles();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [values, setValues] = useState({});
  const [vendorId, setVendorId] = useState(null);
  const [valueUpdate, setValueUpdate] = useState({});
  const [obIds, setObIds] = useState({});

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/inventory/vendor?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getSchool = () => {
    axios
      .get(`${ApiUrl}/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getData();
    getSchool();
  }, []);

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios.delete(`${ApiUrl}/inventory/vendor/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        axios.delete(`${ApiUrl}/inventory/activateVendor/${id}`).then((res) => {
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

  const handleChange = (e) => {
    const temp = { ...values, [e.target.name]: e.target.value };
    setValues(temp);
  };

  const handleSubmit = async () => {
    const entered = Object.keys(values);
    const existing = Object.keys(valueUpdate);
    const newData = entered.filter((e) => existing.includes(e) === false);
    const exData = entered.filter((e) => existing.includes(e) === true);
    const newObId = Object.values(obIds).toString();

    const putFormat = exData.map((val) => ({
      school_id: val,
      vendor_id: vendorId,
      active: true,
      ob_id: obIds[val],
      opening_balance: values[val],
    }));

    const post = {};

    newData.map((v) => {
      post[v] = values[v];
    });

    const postFormat = {};
    postFormat["active"] = true;
    postFormat["school_id"] = post;
    postFormat["vendor_id"] = vendorId;

    if (Object.keys(post).length > 0) {
      await axios
        .post(`${ApiUrl}/inventory/vendorOpeningBalance`, postFormat)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Updated Opening Balance",
          });
          setWrapperOpen(false);
          navigate("/InventoryMaster", { replace: true });
          setAlertOpen(true);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });

          console.log(err);
        });
    }

    if (putFormat.length > 0) {
      await axios
        .put(
          `${ApiUrl}/inventory/UpdateVendorOpeningBalance1/${newObId}`,
          putFormat
        )
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Updated Opening Balance",
          });
          setWrapperOpen(false);
          navigate("/InventoryMaster", { replace: true });
          setAlertOpen(true);
        })
        .catch((err) => {
          console.log(err.response.data.message);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
          console.log(err);
        });
    }
  };

  const handleOpeningBalance = (params) => {
    setWrapperOpen(true);
    setVendorId(params.row.id);
    axios
      .get(`${ApiUrl}/inventory/getVendorOpeningBalance/${params.row.id}`)
      .then((res) => {
        const ob = {};
        const id = {};
        res.data.data.map((val) => {
          ob[val.school_id] = val.opening_balance;
          id[val.school_id] = val.ob_id;
        });
        setValues(ob);
        setValueUpdate(ob);
        setObIds(id);
      });
  };

  const columns = [
    { field: "vendor_name", headerName: "Vendor", flex: 1 },
    {
      field: "vendor_email",
      headerName: "Email",
      flex: 1,
    },
    { field: "vendor_contact_no", headerName: "Contact Number", flex: 1 },
    {
      field: "vendor_gst_no",
      headerName: "GST Number",
      flex: 1,
    },
    { field: "pan_number", headerName: "PAN Number", flex: 1 },
    { field: "vendor_bank_ifsc_code", headerName: "IFSC Code", flex: 1 },

    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "vendor_id",
      headerName: "View PDF",
      renderCell: (params) => {
        return (
          <IconButton
            label="View PDF"
            onClick={() => navigate(`/VendorIndex/View/${params.row.id}`)}
          >
            <RemoveRedEyeIcon />
          </IconButton>
        );
      },
    },

    {
      field: "modified_username",
      headerName: "OB",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton
          onClick={() => {
            handleOpeningBalance(params);
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>,
      ],
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/InventoryMaster/Vendor/Update/${params.row.id}`)
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
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <ModalWrapper open={wrapperOpen} maxWidth={1000} setOpen={setWrapperOpen}>
        <>
          <Box component="form" p={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <TableContainer
                component={Paper}
                className={classes.tableContainer}
              >
                <Table aria-label="customized table" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>School</StyledTableCell>
                      <StyledTableCell align="center">
                        Opening Balance
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schoolOptions.map((val, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          {val.label}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <CustomTextField
                            label="OB"
                            value={values[val.value] ? values[val.value] : ""}
                            style={{ width: 200 }}
                            name={val.value.toString()}
                            handleChange={handleChange}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-start"
                textAlign="right"
              >
                <Grid item xs={12} md={6}>
                  <Button
                    style={{ borderRadius: 7 }}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
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
          onClick={() => navigate("/InventoryMaster/Vendor/New")}
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
export default VendorIndex;
