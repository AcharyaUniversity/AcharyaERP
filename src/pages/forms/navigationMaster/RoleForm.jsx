import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  roleName: "",
  roleShortName: "",
  roleDesc: "",
  access: "",
  backDate: "",
};

const requiredFields = [
  "roleName",
  "roleShortName",
  "roleDesc",
  "access",
  "backDate",
];

function RoleForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState(null);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    roleName: [values.roleName !== ""],
    roleShortName: [
      values.roleShortName !== "",
      /^[A-Za-z ]{3,3}$/.test(values.roleShortName),
    ],
    roleDesc: [values.roleName !== ""],
  };

  const errorMessages = {
    roleName: ["This field required"],
    roleShortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    roleDesc: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/navigationmaster/role/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Navigation Master", link: "/NavigationMaster/Role" },
        { name: "Role" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getRoleData();
    }
  }, [pathname]);

  const getRoleData = async () => {
    await axios
      .get(`${ApiUrl}/Roles/${id}`)
      .then((res) => {
        setValues({
          roleName: res.data.data.role_name,
          roleShortName: res.data.data.role_short_name,
          roleDesc: res.data.data.role_desc,
          id: res.data.data.role_id,
          access: res.data.data.access,
          backDate: res.data.data.back_date,
        });
        setRoleId(res.data.data.role_id);
        setCrumbs([
          { name: "Navigation Master", link: "/NavigationMaster/Role" },
          { name: "Role" },
          { name: "Update" },
          { name: res.data.data.role_name },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    if (e.target.name === "roleShortName") {
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.role_name = values.roleName;
      temp.role_short_name = values.roleShortName;
      temp.role_desc = values.roleDesc;
      temp.access = values.access;
      temp.back_date = values.backDate;
      await axios
        .post(`${ApiUrl}/Roles`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Role created",
            });
            navigate("/NavigationMaster/Role", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.role_name = values.roleName;
      temp.role_short_name = values.roleShortName;
      temp.role_desc = values.roleDesc;
      temp.role_id = values.id;
      temp.access = values.access;
      temp.back_date = values.backDate;
      await axios
        .put(`${ApiUrl}/Roles/${roleId}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Role updated",
            });
            navigate("/NavigationMaster/Role", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.res ? err.res.data.message : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="roleName"
              label="Role Name"
              value={values.roleName}
              handleChange={handleChange}
              checks={checks.roleName}
              errors={errorMessages.roleName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="roleShortName"
              label="Short Name"
              value={values.roleShortName}
              handleChange={handleChange}
              checks={checks.roleShortName}
              errors={errorMessages.roleShortName}
              required
              inputProps={{
                minLength: 3,
                maxLength: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              name="roleDesc"
              label="Description"
              value={values.roleDesc}
              handleChange={handleChange}
              checks={checks.roleDesc}
              errors={errorMessages.roleDesc}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="access"
              label="HR Access"
              value={values.access}
              items={[
                {
                  value: "true",
                  label: "Yes",
                },
                {
                  value: "false",
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="backDate"
              label="Leave Initiation"
              value={values.backDate}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
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

export default RoleForm;
