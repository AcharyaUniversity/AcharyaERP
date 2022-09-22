import { React, useEffect, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const initialValues = {
  tallyHead: "",
  remarks: "",
};

const requiredFields = ["tallyHead", "remarks"];

function TallyheadForm() {
  const { id } = useParams();
  const [values, setValues] = useState(initialValues);
  const [isNew, setIsNew] = useState(true);
  const [formValid, setFormValid] = useState({});
  const [tallyId, setTallyId] = useState(null);
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/tallyhead/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Tallyhead" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getTallyheadData();
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: true }));
      });
    }
  }, []);
  const getTallyheadData = () => {
    axios.get(`${ApiUrl}/finance/TallyHead/${id}`).then((res) => {
      setValues({
        tallyHead: res.data.data.tally_fee_head,
        remarks: res.data.data.remarks,
      });
      setTallyId(res.data.data.tally_id);
      setCrumbs([
        { name: "AccountMaster", link: "AccountMaster" },
        { name: "Tallyhead" },
        { name: "Update" },
        { name: res.data.data.tally_fee_head },
      ]);
    });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.tally_fee_head = values.tallyHead;
      temp.remarks = values.remarks;
      await axios
        .post(`${ApiUrl}/finance/TallyHead`, temp)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: "Tallyhead Created",
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
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.tally_id = tallyId;
      temp.tally_fee_head = values.tallyHead;
      temp.remarks = values.remarks;
      await axios
        .put(`${ApiUrl}/finance/TallyHead/${id}`, temp)
        .then((response) => {
          setAlertMessage({
            severity: "success",
            message: "Tallyhead Updated",
          });

          setAlertOpen(true);
          navigate("/AccountMaster", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
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
                  name="tallyHead"
                  label="Tally Head"
                  value={values.tallyHead}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.tallyHead !== "",
                    /^[A-Za-z ]+$/.test(values.tallyHead),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  label="Remarks"
                  name="remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                  errors={["This field required"]}
                  checks={[values.remarks.length !== 0]}
                  setFormValid={setFormValid}
                  required
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
export default TallyheadForm;
