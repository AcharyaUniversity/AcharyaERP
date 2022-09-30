import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import ApiUrl from "../../services/Api";
import useAlert from "../../hooks/useAlert";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../components/Inputs/CustomSelect";
import axios from "axios";
import CustomModal from "../../components/CustomModal";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
const initialValues = {
  candidateName: "",
  dob: null,
  gender: "",
  fatherName: "",
  email: "",
  phoneNumber: "",
  schoolId: "",
  programId: "",
  SpecializationID: "",
};
const formValidInit = {
  candidateName: false,
  dob: false,
  gender: false,
  fatherName: false,
  email: false,
  phoneNumber: false,
  schoolId: false,
  programId: false,
  SpecializationID: false,
};
const requiredFields = [
  "candidateName",
  "dob",
  "gender",
  "fatherName",
  "email",
  "phoneNumber",
  "schoolId",
  "programId",
  "SpecializationID",
];
function ApplicationForm() {
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const [formValid, setFormValid] = useState(formValidInit);
  const [isNew, setIsNew] = useState(true);
  const [specialization, setSpecialization] = useState([]);
  const [program, setProgram] = useState([]);
  const [school, setSchool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.toLowerCase() === "/candidatewalkinmaster/candidate/new") {
      setIsNew(true);
      setCrumbs([
        { name: "CandidateWalkinMaster", link: "/CandidateWalkinMaster" },
        { name: "Candidate" },
        { name: "New" },
      ]);
    } else {
      setIsNew(false);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  useEffect(() => {
    getSpecialization();
    getProgram();
    getSchool();
  }, []);

  const getSpecialization = () => {};
  const getProgram = () => {};

  const getSchool = () => {
    axios.get(`${ApiUrl}/institute/school`).then((res) => {
      setSchool(
        res.data.data.map((obj) => ({
          value: obj.school_id,
          label: obj.school_name,
        }))
      );
    });
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleschool = (name, newValue) => {
    axios.get(`${ApiUrl}/academic/fetchProgram1/${newValue}`).then((res) => {
      setProgram(
        res.data.data.map((obj) => ({
          value: obj.program_id,
          label: obj.program_name,
        }))
      );
    });

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleProgram = (name, newValue) => {
    axios
      .get(
        `${ApiUrl}/academic/FetchProgramSpecialization/${values.schoolId}/${newValue}`
      )
      .then((res) => {
        setSpecialization(
          res.data.data.map((obj) => ({
            value: obj.program_specialization_id,
            label: obj.program_specialization_name,
          }))
        );
      });
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleModalOpen = (action) => {
    if (action === "discard") {
      setModalContent({
        title: "",
        message: "Are you sure ? All fields will be discarded.",
        buttons: [
          {
            name: "Continue",
            color: "primary",
            func: handleDiscard,
          },
        ],
      });
      setModalOpen(true);
    }
  };

  const handleDiscard = () => {
    setValues(initialValues);
  };

  const handleSubmit = async (e) => {
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
      temp.active = true;
      temp.candidate_name = values.candidateName;
      temp.date_of_birth = values.dob;
      temp.gender = values.gender;
      temp.father_name = values.fatherName;
      temp.program_id = values.programId;
      temp.candidate_email = values.email;
      temp.mobile_number = values.phoneNumber;
      temp.school_id = values.schoolId;
      temp.program_specilaization_id = values.SpecializationID;

      await axios
        .post(`${ApiUrl}/student/Candidate_Walkin1`, temp)
        .then((response) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/CandidateWalkinMaster", { replace: true });
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
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <FormWrapper>
          <Box>
            <Grid
              container
              justifycontents="flex-start"
              alignItems="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="candidateName"
                  label="Candidate Name"
                  value={values.candidateName}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.candidateName !== "",
                    values.candidateName.trim().split(/ +/).join(" "),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="dob"
                  label="Date of Birth"
                  value={values.dob}
                  handleChangeAdvance={handleChangeAdvance}
                  // minDate={values.dob ? values.dob : null}
                  maxDate={new Date(`12/31/${new Date().getFullYear() - 15}`)}
                  setFormValid={setFormValid}
                  checks={[
                    values.dob !== null,
                    values.dob &&
                      values.dob.getFullYear() <= new Date().getFullYear() - 15,
                  ]}
                  errors={[
                    "This field required",
                    "Age must be greater than 15 years",
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelect
                  name="gender"
                  label="Gender"
                  value={values.gender}
                  items={[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                  ]}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="fatherName"
                  label="Father Name"
                  value={values.fatherName}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.fatherName !== "",
                    values.fatherName.trim().split(/ +/).join(" "),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="email"
                  label="Email"
                  value={values.email}
                  handleChange={handleChange}
                  helperText=" "
                  errors={["This field is required", "Invalid email"]}
                  checks={[
                    values.email !== "",
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                      values.email
                    ),
                    values.email.trim().split(/ +/).join(" "),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="phoneNumber"
                  label="Phone Number"
                  value={values.phoneNumber}
                  handleChange={handleChange}
                  errors={["Invalid phone"]}
                  checks={[/^[0-9]{10}$/.test(values.phoneNumber)]}
                  setFormValid={setFormValid}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="schoolId"
                  label="Select School"
                  value={values.schoolId}
                  options={school}
                  handleChangeAdvance={handleschool}
                  setFormValid={setFormValid}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="programId"
                  label="Select Program"
                  value={values.programId}
                  options={program}
                  handleChangeAdvance={handleProgram}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="SpecializationID"
                  label="Select Specialization"
                  value={values.SpecializationID}
                  options={specialization}
                  handleChangeAdvance={handleChangeAdvance}
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
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="error"
                      disabled={loading}
                      onClick={() => handleModalOpen("discard")}
                    >
                      <strong>Discard</strong>
                    </Button>
                  </Grid>

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
                        <strong>Create</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </FormWrapper>
      </Box>
    </>
  );
}
export default ApplicationForm;
