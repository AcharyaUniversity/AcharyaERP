import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import useAlert from "../../hooks/useAlert";
import CustomTextField from "../../components/Inputs/CustomTextField";
import ApiUrl from "../../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const initialValues = {
  voucherHead: "",
  shortName: "",
  isCommon: "",
};

const requiredFields = ["voucherHead", "shortName"];

function VoucherForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [voucherId, setVoucherId] = useState(null);
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/accountmaster/voucher/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "AccountMaster", link: "/AccountMaster" },
        { name: "Voucher" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/finance/VoucherHeadNew/${id}`)
      .then((res) => {
        const data = res.data.data;
        setValues({
          voucherHead: data.voucher_head,
          shortName: data.voucher_head_short_name,
          id: data.voucher_head_new_id,
          isCommon: data.is_common,
        });
        setVoucherId(data.voucher_head_new_id);
        setCrumbs([
          { name: "AccountMaster", link: "/AccountMaster" },
          { name: "Voucher" },
          { name: "Update" },
          { name: data.voucher_head },
        ]);
      })
      .catch((err) => console.error(err));
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.voucher_head = values.voucherHead;
      temp.voucher_head_short_name = values.shortName;
      temp.is_common = values.isCommon;
      await axios
        .post(`${ApiUrl}/finance/VoucherHeadNew`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/VoucherIndex", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message
              ? error.response.data.message
              : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async (e) => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Error",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.voucher_head = values.voucherHead;
      temp.voucher_head_short_name = values.shortName;
      temp.voucher_head_new_id = values.id;
      temp.is_common = values.isCommon;

      await axios
        .put(`${ApiUrl}/finance/VoucherHeadNew/${voucherId}`, temp)
        .then((res) => {
          setLoading(true);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/VoucherIndex", { replace: true });
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
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="voucherHead"
                label="Voucher Head"
                value={values.voucherHead}
                handleChange={handleChange}
                errors={["This field required"]}
                checks={[values.voucherHead !== ""]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="shortName"
                label="Short Name"
                value={values.shortName}
                handleChange={handleChange}
                errors={["This field required"]}
                checks={[values.shortName !== ""]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="isCommon"
                label="Is Common"
                value={values.isCommon}
                items={[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ]}
                handleChange={handleChange}
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
    </>
  );
}
export default VoucherForm;
