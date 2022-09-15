import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import ApiUrl from "../../services/Api";
import axios from "axios";
import useAlert from "../../hooks/useAlert";

function TallyheadUpdate() {
  const { id } = useParams();

  const [data, setData] = useState({
    tallyHead: "",
    remarks: "",
  });
  const [formValid, setFormValid] = useState({
    tallyHead: true,
  });

  const [tallyId, setTallyId] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const getData = async () => {
    axios.get(`${ApiUrl}/finance/TallyHead/${id}`).then((res) => {
      setData({
        tallyHead: res.data.data.tally_fee_head,
        remarks: res.data.data.remarks,
      });
      setTallyId(res.data.data.tally_id);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

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
      temp.tally_id = tallyId;
      temp.tally_fee_head = data.tallyHead;
      temp.remarks = data.remarks;
      await axios
        .put(`${ApiUrl}/finance/TallyHead/${id}`, temp)
        .then((response) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
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
                        <strong>Update</strong>
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
export default TallyheadUpdate;
