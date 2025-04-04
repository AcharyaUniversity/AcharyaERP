import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  itemName: "",
  shortName: "",
  goodsType: "",
  library_book_status: false,
  isAccession: false,
  ledger: "",
  uom: "",
};

const requiredFields = ["itemName", "shortName", "goodsType", "ledger","uom"];

function ItemCreation() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [programId, setProgramId] = useState(null);
  const [ledgerOption, setLedgerOption] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    itemName: [values.itemName !== ""],
    shortName: [values.shortName !== ""],
    goodsType: [values.goodsType !== ""],
  };
  const errorMessages = {
    itemName: ["This field is required"],
    shortName: ["This field required"],
    goodsType: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/itemcreation") {
      setIsNew(true);
      setCrumbs([{ name: "InventoryMaster", link: "/ItemIndex" }]);
    } else {
      setIsNew(false);
      getProgramData();
    }
  }, []);

  useEffect(() => {
    getLedger();
    getUnits();
  }, []);

  const getLedger = async () => {
    await axios
      .get(`/api/finance/getAllJournalTypeExceptInflow`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.voucher_head_new_id,
            label: obj.voucher_head,
            ledger_id: obj.ledger_id,
          });
        });
        setLedgerOption(data);
      });
  };

  const getUnits = async () => {
    await axios
      .get(`/api/activeMeasure`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.measure_id,
            label: obj.measure_name,
          });
        });
        setUnitOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getProgramData = async () => {
    await axios
      .get(`/api/inventory/itemsCreation/${id}`)
      .then((res) => {
        setValues({
          itemName: res.data.data.item_names,
          shortName: res.data.data.item_short_name,
          goodsType: res.data.data.item_type,
          library_book_status: res.data.data.library_book_status,
          isAccession: res.data.data.is_accession,
          ledger: res.data.data.voucher_head_new_id,
          uom: res.data.data.measure_id,
        });
        setProgramId(res.data.data.item_id);
        setCrumbs([{ name: "InventoryMaster", link: "/ItemIndex" }]);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.item_names = values.itemName;
      temp.item_short_name = values.shortName.toUpperCase();
      temp.item_type = values.goodsType;
      temp.library_book_status = values.library_book_status;
      temp.is_accession = values.isAccession;
      temp.ledger_id = ledgerOption.find(
        (obj) => obj.value === values.ledger
      )?.ledger_id;
      temp.measure_id = values.uom;
      temp.voucher_head_new_id = values.ledger;

      await axios
        .post(`/api/inventory/itemsCreation`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Item Created",
            });
            navigate("/ItemIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.item_id = programId;
      temp.item_names = values.itemName;
      temp.item_short_name = values.shortName.toUpperCase();
      temp.item_type = values.goodsType;
      temp.is_accession = values.isAccession;
      temp.library_book_status = values.library_book_status;
      temp.ledger_id = ledgerOption.find(
        (obj) => obj.value === values.ledger
      )?.ledger_id;
      temp.voucher_head_new_id = values.ledger;
      temp.measure_id = values.uom;

      await axios
        .put(`/api/inventory/itemsCreation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Item Updated",
            });
            navigate("/ItemIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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
        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="itemName"
              label="Item"
              value={values.itemName}
              handleChange={handleChange}
              errors={errorMessages.itemName}
              checks={checks.itemName}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="shortName"
              label="Short Name"
              value={values.shortName}
              handleChange={handleChange}
              errors={errorMessages.shortName}
              checks={checks.shortName}
              inputProps={{
                minLength: 1,
                maxLength: 5,
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomSelect
              name="goodsType"
              label="Type"
              value={values.goodsType}
              handleChange={handleChange}
              items={[
                { label: "Goods", value: "Goods" },
                { label: "Service", value: "Service" },
              ]}
              checks={checks.goodsType}
              errors={errorMessages.goodsType}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="ledger"
              label="Voucher Head"
              value={values.ledger}
              options={ledgerOption}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="uom"
              label="Units"
              value={values.uom}
              options={unitOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {values.goodsType === "Goods" && (
            <>
              <Grid item xs={12} md={2.4}>
                <CustomRadioButtons
                  name="library_book_status"
                  label="Library Book"
                  value={values.library_book_status}
                  items={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={2.4}>
                <CustomRadioButtons
                  name="isAccession"
                  label="Is Accession"
                  value={values.isAccession}
                  items={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} textAlign="right">
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

export default ItemCreation;
