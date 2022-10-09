import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import FormWrapper from "../../components/FormWrapper";

import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const initialValues = {
  financialYear: "",
  fromDate: null,
  toDate: null,
  secondYear: "",
  firstYear: "",
};

const requiredFields = ["fromDate", "toDate"];

function FinancialyearForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [financialYearId, setFinancialYearId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (pathname.toLowerCase() === "/academiccalendars/financialyear/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Financial Year" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getFinancialYearData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getFinancialYearData = () => {
    axios.get(`${ApiUrl}/FinancialYear/${id}`).then((res) => {
      console.log(res.data.data);
      setValues({
        financialYear: res.data.data.financial_year,
        fromDate: res.data.data.from_date,
        toDate: res.data.data.to_date,
      });
      setFinancialYearId(res.data.data.financial_year_id);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Financial Year" },
        { name: "Update" },
        { name: "" },
      ]);
    });
  };

  const handleChange = (e) => {
    const Firstyearone = e.target.value;
    const Secondyearone = (parseInt(e.target.value) + 1).toString();
    const concat = Firstyearone + "-" + Secondyearone;
    setValues({
      ...values,
      financialYear: concat,
      secondYear: Secondyearone,
      firstYear: Firstyearone,
    });
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleCreate = async (e) => {
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
      temp.financial_year = values.financialYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;

      await axios
        .post(`${ApiUrl}/FinancialYear`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/AcademicCalendars", { replace: true });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };
  const handleUpdate = async (e) => {
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
      temp.financial_year_id = financialYearId;
      temp.financial_year = values.financialYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;

      await axios
        .put(`${ApiUrl}/FinancialYear/${id}`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Updated Successfully",
          });
          setAlertOpen(true);
          navigate("/AcademicCalendars", { replace: true });
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
              {isNew ? (
                <>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="firstYear"
                      label="Financial Year"
                      helperText="  "
                      value={values.firstYear}
                      handleChange={handleChange}
                      errors={["This field is required", "Enter Only Numbers"]}
                      checks={[
                        values.firstYear,
                        /^[0-9]{4}$/.test(values.firstYear),
                      ]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="secondYear"
                      value={values.secondYear}
                      helperText="  "
                      disabled={!isNew}
                      handleChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    name="financialYear"
                    label="Financial Year"
                    helperText="  "
                    value={values.financialYear}
                    disabled={!isNew}
                    handleChange={handleChange}
                    fullWidth
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  minDate={new Date()}
                  errors={["This field is required"]}
                  checks={[values.fromDate !== null]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="toDate"
                  label="To Date"
                  value={values.toDate}
                  handleChangeAdvance={handleChangeAdvance}
                  minDate={values.fromDate}
                  errors={[
                    "This field is required",
                    `To Date must be greater than from date`,
                  ]}
                  checks={[
                    values.toDate !== null,
                    values.toDate > values.fromDate,
                  ]}
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
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={isNew ? handleCreate : handleUpdate}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>{isNew ? "Create" : "Update"}</strong>
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
export default FinancialyearForm;
