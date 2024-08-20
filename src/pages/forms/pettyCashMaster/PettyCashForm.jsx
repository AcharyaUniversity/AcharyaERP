import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  schoolId: "",
  amount: "",
  remarks: "",
  active: true,
};

const requiredFields = ["schoolId", "amount", "remarks"];

function PettyCashForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const checks = {
    amount: [values.amount !== "", /^[0-9]*$/.test(values.amount)],
    remarks: [values.remarks !== ""],
  };

  const errorMessages = {
    schoolId: [values.schoolId !== ""],
    amount: ["This field is required", "Invalid Amount"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    getSchoolDetails();
    if (pathname.toLowerCase() === "/pettycashmaster/pettycash/new") {
      setIsNew(true);
      setCrumbs([
        { name: "PettyCashMaster", link: "/PettyCashMaster" },
        { name: "Petty Cash" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getPettyCash();
    }
  }, [pathname]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
            school_name_short: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getPettyCash = async () => {
    await axios
      .get(`/api/finance/getPettyCash/${id}`)
      .then((res) => {
        const data = res.data.data;
        console.log(data,"data");
        
        setValues({
          schoolId: data.school_id,
          amount: data.amount,
          remarks: data.remark,
          active: data.active,
        });
        setCrumbs([
          { name: "PettyCashMaster", link: "/PettyCashMaster/PettyCash" },
          { name: "Petty Cash" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        school_id: values.schoolId,
        amount: values.amount,
        remark: values.remarks,
        active: true,
      };

      await axios
        .post(`/api/finance/createPettyCash`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/PettyCashMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Petty Cash created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {
        school_id: values.schoolId,
        amount: values.amount,
        remark: values.remarks,
        active: values.active,
        petty_cash_id: id,
      };

      await axios
        .put(`/api/finance/updatePettyCash/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/PettyCashMaster", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Petty Cash Updated",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occurred",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occurred",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={6} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
              // disabled = {!isNew}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <CustomTextField
              type="number"
              name="amount"
              label="Amount"
              InputProps={{ inputProps: { min: 0 } }}
              value={values.amount}
              handleChange={handleChange}
              errors={errorMessages.amount}
              checks={checks.amount}
              required
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              required
              checks={checks.remarks}
              errors={errorMessages.remarks}
              // disabled = {!isNew}
            />
          </Grid>

          <Grid item xs={12} align="right">
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
                  color="inherit"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default PettyCashForm;
