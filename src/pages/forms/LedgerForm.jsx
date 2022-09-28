import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const initialValues = {
  ledgerName: "",
  ledgerShortName: "",
  groupId: "",
  priority: "",
  remarks: "",
};

const requiredFields = ["ledgerName", "ledgerShortName"];

function LedgerForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();
  const { pathname } = useLocation();
  const [formValid, setFormValid] = useState({});
  const [ledgerId, setLedgerId] = useState(null);
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState([]);

  useEffect(() => {
    getGroup();
    if (pathname.toLowerCase() === "/accountmaster/ledger/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Ledger" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLedgerData();
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: true }));
      });
    }
  }, []);

  const getGroup = async () => {
    axios
      .get(`${ApiUrl}/group`)
      .then((res) => {
        setGroup(
          res.data.data.map((obj) => ({
            value: obj.group_id,
            label: obj.group_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getLedgerData = async () => {
    await axios
      .get(`${ApiUrl}/finance/Ledger/${id}`)
      .then((res) => {
        setValues({
          ledgerName: res.data.data.ledger_name,
          ledgerShortName: res.data.data.ledger_short_name,
          groupId: res.data.data.group_id,
          priority: res.data.data.priority,
          remarks: res.data.data.remarks,
        });
        setLedgerId(res.data.data.ledger_id);
        setCrumbs([
          { name: "AccountMaster", link: "AccountMaster" },
          { name: "Ledger" },
          { name: "Update" },
          { name: res.data.data.ledger_name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const handleChange = (e) => {
    if (e.target.name === "ledgerShortName") {
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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      const temp = {};
      temp.active = true;
      temp.ledger_name = values.ledgerName;
      temp.ledger_short_name = values.ledgerShortName;
      temp.group_id = values.groupId;
      temp.priority = values.priority;
      temp.remarks = values.remarks;
      await axios
        .post(`${ApiUrl}/finance/Ledger`, temp)
        .then((response) => {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Ledger Created",
          });
          setAlertOpen(true);
          navigate("/AccountMaster", { replace: true });
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      console.log("failed");
    } else {
      const temp = {};
      temp.active = true;
      temp.ledger_id = ledgerId;
      temp.ledger_name = values.ledgerName;
      temp.ledger_short_name = values.ledgerShortName;
      temp.group_id = values.groupId;
      temp.priority = values.priority;
      temp.remarks = values.remarks;
      await axios
        .put(`${ApiUrl}/finance/Ledger/${id}`, temp)
        .then((res) => {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: "Ledger Updated",
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
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="ledgerName"
                  label="Ledger Name"
                  value={values.ledgerName ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.ledgerName !== "",
                    /^[A-Za-z ]+$/.test(values.ledgerName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="ledgerShortName"
                  label="Short Name"
                  value={values.ledgerShortName ?? ""}
                  inputProps={{
                    minLength: 3,
                    maxLength: 3,
                  }}
                  handleChange={handleChange}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    values.ledgerShortName !== "",
                    /^[A-Za-z ]{3}$/.test(values.ledgerShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="groupId"
                  label="Group"
                  value={values.groupId}
                  options={group}
                  handleChangeAdvance={handleChangeAdvance}
                  errors={["This field is required"]}
                  checks={[values.groupId !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  label="Priority"
                  name="priority"
                  value={values.priority}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  name="remarks"
                  value={values.remarks}
                  label="Remarks"
                  handleChange={handleChange}
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
export default LedgerForm;
