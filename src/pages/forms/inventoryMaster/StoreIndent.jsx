import { useState, useEffect, lazy } from "react";
import {
  Box,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  styled,
  TableCell,
  TableBody,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "../../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));
const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const initialValues = {
  itemId: null,
  measureId: null,
  description: "",
  quantity: "",
  units: "",
  remarks: "",
  requestedDate: "",
  approverStatus: "",
};

const requiredFields = [];

function StoreIndent() {
  const [values, setValues] = useState([
    initialValues,
    initialValues,
    initialValues,
    initialValues,
    initialValues,
  ]);

  const [data, setData] = useState({ remarks: "" });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unit, setUnit] = useState([]);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const checks = {};

  useEffect(() => {}, [pathname]);

  useEffect(() => {
    setCrumbs([
      { name: "Store Indent", link: "/InventoryMaster/StoreIndentIndex  " },
    ]);
    getItemsData();
    getUnitData();
  }, [values]);

  const getItemsData = async () => {
    await axios(`/api/inventory/getItemNameConcatWithdescriptionAndMake`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.env_item_id,
            label: obj.ITEM_NAME,
            })
          })
        setItems(data);
      })
      .catch((err) => console.error(err));
  };

  const getUnitData = async () => {
    await axios(`/api/activeMeasure`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.measure_id,
            label: obj.measure_name,
          })
        })
        setUnit(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e, index) => {
    if (e.target.name === "remarks") {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
    setValues((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [e.target.name]: e.target.value };
        return obj;
      })
    );
  };

  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    const index = parseInt(splitName[1]);
    const keyName = splitName[0];

    if (keyName === "itemId") {
      values.map((obj) => {
        if (index > 0 && obj.itemId === newValue) {
          setAlertMessage({
            severity: "error",
            message: "Item is already selected",
          });
          setAlertOpen(true);
        }
      });
    }

    setValues((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [keyName]: newValue };
        return obj;
      })
    );
  };

  const handleAdd = () => {
    setValues((prev) => [...prev, initialValues]);
  };

  const handleRemove = () => {
    const filtered = [...values];
    filtered.pop();
    setValues(filtered);
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = [];

      values.map((obj) => {
        if (obj.itemId !== null && obj.description !== null) {
          temp.push({
            active: true,
            remarks: data.remarks,
            financial_year_id: null,
            env_item_id: obj.itemId,
            quantity: obj.quantity,
            measure_id: obj.units,
            requested_date: obj.requestedDate,
            approver1_status: obj.approverStatus,
            emp_id: userId,
          });
        }
      });

      await axios
        .post(`/api/inventory/storeIndentRequest`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InventoryMaster/StoreIndentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Store Indent Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid item xs={12} mt={2.5} align="right">
          <Button
            variant="contained"
            color="error"
            onClick={handleRemove}
            disabled={values?.length === 1}
            style={{ marginRight: "10px" }}
          >
            <RemoveIcon />
          </Button>

          <Button variant="contained" color="success" onClick={handleAdd}>
            <AddIcon />
          </Button>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
        >
          <Grid item xs={12} md={8} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Item Name *
                    </StyledTableCell>

                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      Quantity
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 100, textAlign: "center" }}>
                      UOM
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCell>
                          <CustomAutocomplete
                            name={"itemId" + "-" + i}
                            label="select one"
                            value={obj.itemId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={items}
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <CustomTextField
                            name="quantity"
                            label=""
                            value={obj.quantity}
                            handleChange={(e) => handleChange(e, i)}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <CustomAutocomplete
                            name={"measureId" + "-" + i}
                            label="select one"
                            value={obj.measureId}
                            handleChangeAdvance={handleChangeAdvance}
                            options={unit}
                          />
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid
          container
          rowSpacing={2}
          justifyContent="center"
          alignItems="center"
          columnSpacing={4}
        >
          <Grid item xs={12} md={4} mb={10} mt={2}>
            <CustomTextField
              multiline
              rows={2}
              label="Remarks"
              value={data.remarks}
              name="remarks"
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} mt={-25} align="right">
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StoreIndent;
