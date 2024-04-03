import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useAlert from "../../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function OpeningBalanceUpdateForm() {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getSchoolOptions();
    getVoucherData();
    setCrumbs([
      { name: "Account Master", link: "/AccountMaster/OpeningBalance" },
      { name: "Opening Balance" },
    ]);
  }, []);

  const getSchoolOptions = async () => {
    const voucherData = await axios
      .get(`/api/inventory/getVendorOpeningBalance/${id}`)
      .then((res) => {
        const temp = {};
        res.data.data.forEach((obj) => {
          temp[obj.school_id] = { ob: obj.opening_balance, obId: obj.ob_id };
        });
        return temp;
      })
      .catch((err) => console.error(err));

    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const temp = [];
        res.data.data.forEach((obj) => {
          temp.push({
            schoolId: obj.school_id,
            schoolName: obj.school_name,
            ob: voucherData[obj.school_id] ? voucherData[obj.school_id].ob : 0,
            updateStatus: voucherData[obj.school_id] ? true : false,
            obId: voucherData[obj.school_id]
              ? voucherData[obj.school_id].obId
              : null,
          });
        });
        setValues(temp);
      })
      .catch((err) => console.error(err));
  };
  console.log("values", values);
  const getVoucherData = async () => {
    await axios
      .get(`/api/finance/VoucherHeadNew/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Account Master", link: "/AccountMaster/Voucherhead" },
          { name: "Opening Balance" },
          { name: res.data.data.voucher_head },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const temp = [];
    values.forEach((obj) => {
      if (obj.schoolId === parseInt(e.target.name)) {
        const tempObj = { ...obj };
        tempObj.ob = e.target.value;
        temp.push(tempObj);
      } else {
        temp.push(obj);
      }
    });
    setValues(temp);
  };

  const handleCreate = async () => {
    const postValues = {};

    values
      .filter((obj) => obj.updateStatus === false)
      .forEach((obj) => {
        if (obj.ob !== 0) {
          postValues[obj.schoolId] = obj.ob;
        }
      });

    if (Object.values(postValues).length > 0) {
      const postData = {};
      postData.active = true;
      postData.voucher_head_new_id = id;
      postData.school_id = postValues;

      setLoading(true);
      await axios
        .post("/api/inventory/vendorOpeningBalance", postData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Opening balance updated successfully !!",
            });
            setAlertOpen(true);
            getSchoolOptions();
            setLoading(false);
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message
              ? err.response.data.message
              : "Error",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    }

    const putData = [];
    const ids = [];

    values
      .filter((obj) => obj.updateStatus === true)
      .forEach((obj) => {
        if (obj.ob !== 0) {
          putData.push({
            school_id: obj.schoolId,
            voucher_head_new_id: id,
            active: true,
            ob_id: obj.obId,
            opening_balance: obj.ob,
          });

          ids.push(obj.obId);
        }
      });

    if (putData.length > 0) {
      setLoading(true);
      await axios
        .put(
          `/api/inventory/UpdateVendorOpeningBalance1/${ids.toString()}`,
          putData
        )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Opening balance updated successfully !!",
            });
            setAlertOpen(true);
            getSchoolOptions();
            setLoading(false);
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
            setAlertOpen(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message
              ? err.response.data.message
              : "Error",
          });
          setAlertOpen(true);
          setLoading(false);
        });
    }
  };

  return (
    <Box p={1}>
      <FormPaperWrapper>
        <Grid container columnSpacing={2} rowSpacing={2}>
          {values.map((obj, i) => {
            return (
              <Grid item xs={12} md={3} key={i}>
                <Card elevation={2}>
                  <CardHeader
                    title={obj.schoolName.toLowerCase()}
                    titleTypographyProps={{ variant: "subtitle2" }}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "headerWhite.main",
                      padding: 1,
                      textTransform: "capitalize",
                    }}
                  />
                  <CardContent>
                    <CustomTextField
                      name={obj.schoolId.toString()}
                      value={obj.ob}
                      handleChange={handleChange}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleCreate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                "Update"
              )}
            </Button>
          </Grid>

          {/* <Grid item xs={12} md={8}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: "70%" }}>
                      School
                    </StyledTableCell>
                    <StyledTableCell>OB</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {values.map((obj, i) => {
                    return (
                      <TableRow key={i}>
                        <StyledTableCellBody>
                          {obj.schoolName}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          <CustomTextField />
                        </StyledTableCellBody>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid> */}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default OpeningBalanceUpdateForm;
