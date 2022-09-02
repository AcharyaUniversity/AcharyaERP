import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

const initialValues = {
  voucher_head_new_id: "",
  ledger_id: "",
  voucher_type: "",
  budget_head: "",
  cash_or_bank: "",
  salaries: "",
  voucher_priority: "",
  school_id: "",
};
const formValidInit = {
  voucher_head_new_id: false,
  ledger_id: false,
  voucher_type: false,
  budget_head: false,
  cash_or_bank: false,
  salaries: false,
  school_id: false,
  voucher_priority: false,
};
function VoucherHeadAssignmentCreation() {
  const [data, setData] = useState(initialValues);
  const [Vouchers, setVouchers] = useState([]);
  const [Ledgers, setLedgers] = useState([]);
  const [School, setSchool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
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
  const [formValid, setFormValid] = useState(formValidInit);
  useEffect(() => {
    getVouchers();
    getLedgers();
    getSchools();
  }, []);
  const types = [
    { label: "Inflow", value: "inflow" },
    { label: "outFlow", value: "outflow" },
    { label: "Journal", value: "journal" },
    { label: "All", value: "all" },
  ];
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeAdvance = (name, newValue) => {
    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      await axios
        .post(`${ApiUrl}/finance/VoucherHead`, data)
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
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
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
                  value={data.ledger_id}
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
                  value={data.voucher_type}
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
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
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
                  value={data.cash_or_bank}
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
                  value={data.salaries}
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
                  value={data.voucher_priority}
                  fullWidth
                  handleChange={handleChange}
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[data.voucher_priority !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomMultipleAutocomplete
                  name="school_id"
                  label="School"
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
                        <strong>Submit</strong>
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
export default VoucherHeadAssignmentCreation;
