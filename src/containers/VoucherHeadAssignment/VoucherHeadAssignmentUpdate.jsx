import { React, useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useParams } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomAlert from "../../components/CustomAlert";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../components/Inputs/CustomTextField";
const initialValues = {
  voucher_head_new_id: "",
  ledger_id: "",
  voucher_type: "",
  budget_head: "",
  cash_or_bank: "",
  salaries: "",
  voucher_priority: "",
};
const formValidInit = {
  voucher_head_new_id: false,
  ledger_id: false,
  voucher_type: false,
  budget_head: false,
  cash_or_bank: false,
  salaries: false,
  school_id: false,
};
function VoucherHeadAssignmentUpdate() {
  const { id } = useParams();
  const [data, setData] = useState({
    active: true,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [formValid, setFormValid] = useState(formValidInit);
  const [loading, setLoading] = useState(false);
  const [Ledgers, setLedgers] = useState([]);
  const [Vouchers, setVouchers] = useState([]);
  const [School, setSchool] = useState([]);
  const getData = async () => {
    axios.get(`${ApiUrl}/finance/VoucherHead/${id}`).then((Response) => {
      setData(Response.data.data);
      console.log(typeof Response.data.data.voucher_priority);
    });
  };
  const getVouchers = () => {
    axios.get(`${ApiUrl}/finance/VoucherHeadNew`).then((res) => {
      setVouchers(
        res.data.data.map((obj) => ({
          value: obj.voucher_head_new_id,
          label: obj.voucher_head,
        }))
      );
    });
  };
  const getLedgers = () => {
    axios.get(`${ApiUrl}/finance/Ledger`).then((res) => {
      console.log(res);
      setLedgers(
        res.data.data.map((obj) => ({
          value: obj.ledger_id,
          label: obj.ledger_name,
        }))
      );
    });
  };
  const getSchools = () => {
    axios.get(`${ApiUrl}/institute/school`).then((res) => {
      setSchool(
        res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name_short,
        }))
      );
    });
  };
  useEffect(() => {
    getData();
    getLedgers();
    getVouchers();
    getSchools();
  }, []);

  const handleChangeAdvance = (name, newValue) => {
    if (name === "school_id") {
      let val = {};
      newValue.map((m) => {
        let objToAdd1 = { id: [m], ob: 0 };
        val = { ...val, ...objToAdd1 };
      });
      console.log(val);
      setData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const types = [
    { label: "Inflow", value: "inflow" },
    { label: "OutFlow", value: "outflow" },
    { label: "Journal", value: "journal" },
    { label: "All", value: "Both" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    // if (Object.values(formValid).includes(false)) {
    //   setAlertMessage({
    //     severity: "error",
    //     message: "please fill all fields",
    //   });
    //   setAlertOpen(true);
    // } else {
    await axios
      .put(`${ApiUrl}/finance/VoucherHead/${id}`, data)
      .then((res) => {
        setAlertMessage({
          severity: "success",
          message: "",
        });
        setAlertOpen(true);
        if (res.status === 200) {
          window.location.href = "/VoucherHeadAssignmentIndex";
        }
        if (res.status === 201) {
          window.location.href = "/VoucherHeadAssignmentIndex";
        }
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.res.data.message : "Error",
        });
        setAlertOpen(true);
        console.log(error);
      });
    // }
  };
  return (
    <>
      <Box component="form">
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          severity={alertMessage.severity}
          message={alertMessage.message}
        />
        <FormLayout>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  disabled
                  label="Voucher Head"
                  name="voucher_head_new_id"
                  value={data.voucher_head_new_id}
                  options={Vouchers}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  label="Ledger"
                  name="ledger_id"
                  value={parseInt(data.ledger_id)}
                  options={Ledgers}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomSelect
                  label="Voucher Type"
                  name="voucher_type"
                  value="outflow"
                  items={types}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  label="Budget Head"
                  name="budget_head"
                  value={data.budget_head}
                  items={[
                    { label: "Yes", value: "YES" },
                    { label: "No", value: "NO" },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  label="Cash / Bank"
                  name="cash_or_bank"
                  value={data.cash_or_bank ?? ""}
                  items={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomRadioButtons
                  label="Is Salaries"
                  name="salaries"
                  value={data.salaries ?? ""}
                  items={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomTextField
                  label="Priority"
                  name="voucher_priority"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={parseInt(data.voucher_priority) ?? ""}
                  fullWidth
                  handleChange={handleChange}
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[data.voucher_priority !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  disabled
                  label="School"
                  name="school_id"
                  value={data.school_id}
                  options={School}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
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
                      onClick={handleSubmit}
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
        </FormLayout>
      </Box>
    </>
  );
}
export default VoucherHeadAssignmentUpdate;
