import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../components/FormWrapper";
import CustomTextField from "../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const initialValues = {
  orgName: "",
  orgShortName: "",
};

const requiredFields = ["orgName", "orgShortName"];

function OrganizationForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [data, setData] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState(null);
  useEffect(() => {
    if (pathname.toLowerCase() === "/institutemaster/organization/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster" },
        { name: "Organization" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getOrgData();
      requiredFields.forEach((keyName) => {
        setFormValid((prev) => ({ ...prev, [keyName]: false }));
      });
    }
  }, []);

  const getOrgData = () => {
    axios.get(`${ApiUrl}/institute/org/${id}`).then((res) => {
      setData({
        orgName: res.data.data.org_name,
        orgShortName: res.data.data.org_type,
      });
      setOrgId(res.data.data.org_id);
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster" },
        { name: "School" },
        { name: "Update" },
        { name: res.data.data.org_name },
      ]);
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "orgShortName") {
      setData({
        ...data,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.org_name = data.orgName;
      temp.org_type = data.orgShortName;

      await axios
        .post(`${ApiUrl}/institute/org`, temp)
        .then((response) => {
          setLoading(true);
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/InstituteMaster", { replace: true });
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
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.org_id = orgId;
      temp.org_name = data.orgName;
      temp.org_type = data.orgShortName;

      await axios
        .put(`${ApiUrl}/institute/org/${id}`, temp)
        .then((response) => {
          setLoading(true);
          if (response.status === 200 || response.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: response.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="orgName"
              label="Organization"
              value={data.orgName}
              handleChange={handleChange}
              fullWidth
              errors={["This field required", "Enter Only Characters"]}
              checks={[data.orgName !== "", /^[A-Za-z ]+$/.test(data.orgName)]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="orgShortName"
              label="Short Name"
              value={data.orgShortName}
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
                data.orgShortName !== "",
                /^[A-Za-z ]{3,3}$/.test(data.orgShortName),
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>

          <Grid item xs={3} textAlign="right">
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
      </FormWrapper>
    </Box>
  );
}

export default OrganizationForm;
