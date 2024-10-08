import { memo, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Grid, IconButton, Typography } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";
import useAlert from "../../../hooks/useAlert";

const AddressDetailsForm = memo(
  ({
    addressValues,
    setAddressValues,
    addressChecks,
    addressErrorMessages,
  }) => {
    const [country, setCountry] = useState([]);
    const [permanantStates, setPermanantStates] = useState([]);
    const [permanantCities, setPermanantCities] = useState([]);
    const [currentStates, setCurrentStates] = useState([]);
    const [currentCities, setCurrentCities] = useState([]);
    const [localStates, setLocalStates] = useState([]);
    const [localCities, setLocalCities] = useState([]);
    const [copyPermanantStatus, setCopyPermanantStatus] = useState(false);
    const [copyCurrentStatus, setCopyCurrentStatus] = useState(false);

    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
      getCountry();
    }, []);

    useEffect(() => {
      fetchStates(addressValues.permanentCountry, setPermanantStates);
    }, [addressValues.permanentCountry]);

    useEffect(() => {
      fetchStates(addressValues.currentCountry, setCurrentStates);
    }, [addressValues.currentCountry]);

    useEffect(() => {
      fetchStates(addressValues.localCountry, setLocalStates);
    }, [addressValues.localCountry]);

    useEffect(() => {
      fetchCities(
        addressValues.permanentCountry,
        addressValues.permanantState,
        setPermanantCities
      );
    }, [addressValues.permanantState]);

    useEffect(() => {
      fetchCities(
        addressValues.currentCountry,
        addressValues.currentState,
        setCurrentCities
      );
    }, [addressValues.currentState]);

    useEffect(() => {
      fetchCities(
        addressValues.localCountry,
        addressValues.localState,
        setLocalCities
      );
    }, [addressValues.localState]);

    const getCountry = async () => {
      try {
        const res = await axios("/api/Country");
        const data = res.data.map((obj) => ({
          value: obj.id,
          label: obj.name,
        }));
        setCountry(data);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message: err.response?.data?.message || "Failed to load country",
        });
        setAlertOpen(true);
      }
    };

    const fetchStates = async (country, setState) => {
      if (country) {
        try {
          const res = await axios(`/api/State1/${country}`);
          const data = res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }));
          setState(data);
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: err.response?.data?.message || "Failed to load states",
          });
          setAlertOpen(true);
        }
      }
    };

    const fetchCities = async (country, state, setState) => {
      if (country && state) {
        try {
          const res = await axios(`/api/City1/${state}/${country}`);
          const data = res.data.map((obj) => ({
            value: obj.id,
            label: obj.name,
          }));
          setState(data);
        } catch (err) {
          setAlertMessage({
            severity: "error",
            message: err.response?.data?.message || "Failed to load states",
          });
          setAlertOpen(true);
        }
      }
    };

    const copyPermanant = (status) => {
      const {
        permanentAddress,
        permanentCountry,
        permanantState,
        permanantCity,
        permanentPincode,
      } = addressValues;

      setAddressValues((prev) => ({
        ...prev,
        currentAddress: status ? permanentAddress : "",
        currentCountry: status ? permanentCountry : "",
        currentState: status ? permanantState : "",
        currentCity: status ? permanantCity : "",
        currentPincode: status ? permanentPincode : "",
      }));
      setCopyPermanantStatus(status);
    };

    const copyCurrent = (status) => {
      const {
        currentAddress,
        currentCountry,
        currentState,
        currentCity,
        currentPincode,
      } = addressValues;

      setAddressValues((prev) => ({
        ...prev,
        localAddress: status ? currentAddress : "",
        localCountry: status ? currentCountry : "",
        localState: status ? currentState : "",
        localCity: status ? currentCity : "",
        localPincode: status ? currentPincode : "",
      }));

      setCopyCurrentStatus(status);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      const pincodeList = [
        "permanentPincode",
        "currentPincode",
        "localPincode",
      ];
      if (pincodeList.includes(name) && !/^\d*$/.test(value)) return;
      setAddressValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeAdvance = (name, newValue) => {
      setAddressValues((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <Grid container rowSpacing={2} columnSpacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={4}>
            <Grid item xs={12} p={3}>
              <Typography variant="subtitle2" align="center">
                Permanent
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="permanentAddress"
                label="Address"
                value={addressValues.permanentAddress}
                handleChange={handleChange}
                checks={addressChecks.permanentAddress}
                errors={addressErrorMessages.permanentAddress}
                multiline
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="permanentCountry"
                label="Country"
                value={addressValues.permanentCountry}
                options={country}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="permanantState"
                label="State"
                value={addressValues.permanantState}
                options={permanantStates}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="permanantCity"
                label="City"
                value={addressValues.permanantCity}
                options={permanantCities}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="permanentPincode"
                label="Pincode"
                value={addressValues.permanentPincode}
                handleChange={handleChange}
                checks={addressChecks.permanentPincode}
                errors={addressErrorMessages.permanentPincode}
                required
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={4}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="center">
                Correspondence
                <IconButton onClick={() => copyPermanant(!copyPermanantStatus)}>
                  {copyPermanantStatus ? (
                    <UndoIcon color="primary" sx={{ fontSize: 24 }} />
                  ) : (
                    <ContentCopyIcon color="primary" sx={{ fontSize: 24 }} />
                  )}
                </IconButton>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="currentAddress"
                label="Address"
                value={addressValues.currentAddress}
                handleChange={handleChange}
                checks={addressChecks.currentAddress}
                errors={addressErrorMessages.currentAddress}
                multiline
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="currentCountry"
                label="Country"
                value={addressValues.currentCountry}
                options={country}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="currentState"
                label="State"
                value={addressValues.currentState}
                options={currentStates}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="currentCity"
                label="City"
                value={addressValues.currentCity}
                options={currentCities}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="currentPincode"
                label="Pincode"
                value={addressValues.currentPincode}
                handleChange={handleChange}
                checks={addressChecks.currentPincode}
                errors={addressErrorMessages.currentPincode}
                required
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container rowSpacing={3} columnSpacing={4}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" align="center">
                Local
                <IconButton onClick={() => copyCurrent(!copyCurrentStatus)}>
                  {copyCurrentStatus ? (
                    <UndoIcon color="primary" sx={{ fontSize: 24 }} />
                  ) : (
                    <ContentCopyIcon color="primary" sx={{ fontSize: 24 }} />
                  )}
                </IconButton>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="localAddress"
                label="Address"
                value={addressValues.localAddress}
                handleChange={handleChange}
                checks={addressChecks.localAddress}
                errors={addressErrorMessages.localAddress}
                multiline
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="localCountry"
                label="Country"
                value={addressValues.localCountry}
                options={country}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="localState"
                label="State"
                value={addressValues.localState}
                options={localStates}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomAutocomplete
                name="localCity"
                label="City"
                value={addressValues.localCity}
                options={localCities}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                name="localPincode"
                label="Pincode"
                value={addressValues.localPincode}
                handleChange={handleChange}
                checks={addressChecks.localPincode}
                errors={addressErrorMessages.localPincode}
                required
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
);

export default AddressDetailsForm;
