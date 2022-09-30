import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ApiUrl from "../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  measureName: "",
  shortName: "",
};
const requiredFields = ["measureName", "shortName"];

function MeasureForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [formValid, setFormValid] = useState({});
  const [measureId, setMeasureId] = useState(null);

  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/inventorymaster/measure/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "InventoryMaster", link: "/InventoryMaster" },
        { name: "Measure" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getMeasureData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getMeasureData = () => {
    axios
      .get(`${ApiUrl}/measure/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setValues({
          measureName: res.data.data.measure_name,
          shortName: res.data.data.measure_short_name,
        });
        setMeasureId(res.data.data.measure_id);
        setCrumbs([
          { name: "InventoryMaster", link: "/InventoryMaster" },
          { name: "Measure" },
          { name: "Update" },
          { name: res.data.data.MeasureName },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = 1;
      temp.measure_name = values.measureName;
      temp.measure_short_name = values.shortName;

      await axios
        .post(`${ApiUrl}/measure`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/InventoryMaster", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
          console.log(err);
        });
    }
  };

  const handleUpdate = async () => {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = 1;
      temp.measure_id = measureId;
      temp.measure_name = values.measureName;
      temp.measure_short_name = values.shortName;

      await axios
        .put(`${ApiUrl}/updateMeasure/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/InventoryMaster", { replace: true });
          } else {
            setLoading(false);
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
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="measureName"
              label="Measure"
              handleChange={handleChange}
              value={values.measureName}
              errors={["This field is required"]}
              checks={[
                values.measureName !== "",
                values.measureName.trim().split(/ +/).join(" "),
              ]}
              setFormValid={setFormValid}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 1,
                maxLength: 4,
              }}
              fullWidth
              errors={[
                "This field required",
                "Enter characters and its length should be four",
              ]}
              checks={[
                values.shortName !== "",
                /^[A-Z ]{1,4}$/.test(values.shortName),
                values.shortName.trim().split(/ +/).join(" "),
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
              <Grid item xs={4} md={2}>
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default MeasureForm;
