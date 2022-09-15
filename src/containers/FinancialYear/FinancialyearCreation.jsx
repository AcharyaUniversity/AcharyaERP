import { React, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import FormWrapper from "../../components/FormWrapper";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import { useNavigate } from "react-router-dom";
import { convertDateToString } from "../../utils/DateUtils";
import useAlert from "../../hooks/useAlert";
const initialValues = {
  financialYear: "",
  fromDate: null,
  toDate: null,
  remarks: "",
};

function FinancialyearCreation() {
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    financialYear: false,
    fromDate: false,
  });

  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.financial_year = data.financialYear;
      temp.from_date = data.fromDate;
      temp.to_date = data.toDate;
      temp.remarks = data.remarks;
      await axios
        .post(`${ApiUrl}/FinancialYear`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/AccountMaster", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="financialYear"
                  label="Financial Year"
                  value={data.financialYear}
                  helperText="Format:[YYYY-YYYY]"
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required"]}
                  checks={[data.financialYear !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={data.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  errors={
                    data.fromDate
                      ? ["This field is required"]
                      : ["This field is required"]
                  }
                  checks={
                    data.fromDate
                      ? [data.fromDate !== null]
                      : [data.fromDate !== null]
                  }
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="toDate"
                  label="To Date"
                  value={data.toDate}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  value={data.remarks}
                  label="Remarks"
                  name="remarks"
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
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
        </FormWrapper>
      </Box>
    </>
  );
}
export default FinancialyearCreation;
