import { React, useEffect, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useAlert from "../../hooks/useAlert";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const initialValues = {
  tallyHead: "",
  remarks: "",
};

function TallyheadCreation() {
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({
    tallyHead: false,
  });

  const pathname = useLocation();

  const setCrumbs = useBreadcrumbs();

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/tallyhead/creation") {
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "tallyhead" },
        { name: "Create" },
      ]);
    } else {
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      temp.tally_fee_head = data.tallyHead;
      temp.remarks = data.remarks;
      await axios
        .post(`${ApiUrl}/finance/TallyHead`, temp)
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
                  value={data.tallyHead}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    data.tallyHead !== "",
                    /^[A-Za-z ]+$/.test(data.tallyHead),
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
                  value={data.remarks}
                  handleChange={handleChange}
                  errors={["This field required"]}
                  checks={[data.remarks.length !== 0]}
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
export default TallyheadCreation;
