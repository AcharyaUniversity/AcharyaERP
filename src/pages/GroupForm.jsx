import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import FormWrapper from "../components/FormWrapper";
import axios from "axios";
import ApiUrl from "../services/Api";
import CustomSelect from "../components/Inputs/CustomSelect";
import CustomRadioButtons from "../components/Inputs/CustomRadioButtons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const initialValues = {
  groupName: "",
  groupShortName: "",
  priority: "",
  remarks: "",
  financials: "",
  balanceSheet: "",
};
const requiredFields = [
  "groupName",
  "groupShortName",
  "remarks",
  "financials",
  "balanceSheet",
];

function GroupForm() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const setCrumbs = useBreadcrumbs();
  const [groupId, setGroupId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/group/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Group" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getGroupData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getGroupData = () => {
    axios
      .get(`${ApiUrl}/group/${id}`)
      .then((res) => {
        setValues({
          groupName: res.data.data.group_name,
          groupShortName: res.data.data.group_short_name,
          priority: res.data.data.group_priority,
          remarks: res.data.data.remarks,
          financials: res.data.data.financials,
          balanceSheet: res.data.data.balance_sheet_group,
        });
        setGroupId(res.data.data.group_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster" },
          { name: "School" },
          { name: "Update" },
          { name: res.data.data.group_name },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.name === "groupShortName") {
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
      temp.group_name = values.groupName;
      temp.group_short_name = values.groupShortName;
      temp.group_priority = values.priority;
      temp.remarks = values.remarks;
      temp.financials = values.financials;
      temp.balance_sheet_group = values.balanceSheet;
      await axios
        .post(`${ApiUrl}/group`, temp)
        .then((response) => {
          console.log(response);
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
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.group_id = groupId;
      temp.active = true;
      temp.group_name = values.groupName;
      temp.group_short_name = values.groupShortName;
      temp.group_priority = values.priority;
      temp.remarks = values.remarks;
      temp.financials = values.financials;
      temp.balance_sheet_group = values.balanceSheet;
      await axios
        .put(`${ApiUrl}/group/${id}`, temp)
        .then((response) => {
          setLoading(true);
          console.log(response);
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
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="groupName"
                  label="Group"
                  value={values.groupName ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.groupName !== "",
                    /^[A-Za-z ]+$/.test(values.groupName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="groupShortName"
                  label="Short Name"
                  value={values.groupShortName ?? ""}
                  handleChange={handleChange}
                  inputProps={{
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    values.groupShortName !== "",
                    /^[A-Za-z ]{3}$/.test(values.groupShortName),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  name="priority"
                  label="Priority"
                  value={values.priority ?? ""}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelect
                  label="Balance sheet group"
                  name="balanceSheet"
                  value={values.balanceSheet}
                  items={[
                    {
                      value: "Applications Of Funds",
                      label: "Applications Of Funds",
                    },
                    {
                      value: "Source Of Funds",
                      label: "Source Of Funds",
                    },
                  ]}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.balanceSheet !== ""]}
                  setFormValid={setFormValid}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomRadioButtons
                  label="Financial Status"
                  name="financials"
                  value={values.financials}
                  items={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.financials !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  errors={["This field is required"]}
                  checks={[values.remarks !== ""]}
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
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default GroupForm;
