import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";

import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import FormWrapper from "../../components/FormWrapper";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const init = {
  acYear: "",
  acYearCode: "",
  currentYear: "",
};

function AcademicyearForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [isNew, setIsNew] = useState(true);
  const [acYearId, setAcYearId] = useState(null);
  const [values, setValues] = useState(init);

  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    if (pathname.toLowerCase() === "/academiccalendars/academicyear/new") {
      setIsNew(true);

      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "AcademicYear" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getAcademicyearData();
    }
  }, [pathname]);
  const getAcademicyearData = () => {
    axios.get(`${ApiUrl}/academic/academic_year/${id}`).then((res) => {
      setValues({
        acYear: res.data.data.ac_year,
        acYearCode: res.data.data.ac_year_code,
        currentYear: res.data.data.current_year,
      });
      setAcYearId(res.data.data.ac_year_id);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "AcademicYear" },
        { name: "Update" },
        { name: "" },
      ]);
    });
  };

  const handleChange = (e) => {
    let Firstyearone = e.target.value;
    let Secondyearone = (parseInt(e.target.value) + 1).toString();
    let concat = Firstyearone + "-" + Secondyearone;
    setValues((prev) => ({
      acYear: Firstyearone,
      acYearCode: Secondyearone,
      currentYear: concat,
    }));
  };
  const handleCreate = async (e) => {
    const temp = {};
    temp.active = true;
    temp.ac_year = values.currentYear;
    temp.ac_year_code = parseInt(values.acYearCode);
    temp.current_year = values.acYear;

    await axios
      .post(`${ApiUrl}/academic/academic_year`, temp)
      .then((response) => {
        console.log(response);
        setAlertMessage({
          severity: "success",
          message: "Form Submitted Successfully",
        });
        navigate("/AcademicCalendars", { replace: true });
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
      temp.ac_year_id = acYearId;
      temp.ac_year = values.currentYear;
      temp.ac_year_code = values.acYearCode;
      temp.current_year = values.acYear;

      await axios
        .put(`${ApiUrl}/academic/academic_year/${id}`, temp)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: "Form Updated Successfully",
          });
          navigate("/AcademicCalendars", { replace: true });
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
              <Grid item xs={12} md={4}>
                <CustomTextField
                  name="acYear"
                  value={values.acYear}
                  label="Academic Year"
                  handleChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomTextField
                  value={values.acYearCode}
                  handleChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomTextField
                  value={values.acYear ?? ""}
                  label="Current Year"
                  disabled
                />
              </Grid>
              <Grid item>
                <Button
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
                    <>{isNew ? "Create" : "Update"}</>
                  )}
                </Button>
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default AcademicyearForm;
