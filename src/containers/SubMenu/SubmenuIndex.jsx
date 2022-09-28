import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  IconButton,
  List,
  ListItemText,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import CustomModal from "../../components/CustomModal";
import CheckboxAutocomplete from "../../components/Inputs/CheckboxAutocomplete";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import NearMeTwoToneIcon from "@mui/icons-material/NearMeTwoTone";
import { Check, HighlightOff } from "@mui/icons-material";
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import ModalWrapper from "../../components/ModalWrapper";
import useAlert from "../../hooks/useAlert";

const initialValues = { userIds: [] };
const SubmenuIndex = () => {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [submenuName, setSubmenuName] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [submenuId, setSubmenuId] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [role, setRole] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `${ApiUrl}/fetchAllSubMenuDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      });
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios
          .delete(`${ApiUrl}/SubMenu/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        axios
          .delete(`${ApiUrl}/activateSubMenu/${id}`)
          .then((res) => {
            if (res.status == 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };

  const roleList = (data) => {
    setWrapperOpen(true);
    setModalData(data);
    axios
      .get(`${ApiUrl}/fetchAllRoleDetails/${data.id}`)
      .then((res) => {
        setRole(res.data.data.RoleName);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleOpen = async (params) => {
    setOpen(true);
    setSubmenuId(params.row.id);
    setSubmenuName(params.row.submenu_name);
    await axios
      .get(`${ApiUrl}/UserAuthentication`)
      .then((res) => {
        setUserOptions(
          res.data.data.map((obj) => ({
            value: obj.id,
            label: obj.username,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`${ApiUrl}/getSubMenuRelatedUser/${params.row.id}`)
      .then((res) => {
        setValues({ userIds: res.data.data.AssignedUser.toString() });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue.toString(),
    }));
  };

  const handleSelectAll = () => {
    setValues((prev) => ({
      ...prev,
      userIds: userOptions.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = () => {
    setValues((prev) => ({ ...prev, userIds: [] }));
  };

  const postUserDetails = async () => {
    const temp = {};
    temp.user_ids = values.userIds;

    await axios
      .post(`${ApiUrl}/postUserDetails/${submenuId}`, temp)
      .then((res) => {
        if (res.status == 200) {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          setOpen(false);
          navigate("/SubmenuIndex", { replace: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    { field: "submenu_name", headerName: "Submenu ", flex: 1, hideable: false },
    { field: "menu_name", headerName: "Menu ", flex: 1 },
    { field: "submenu_url", headerName: "Url", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      headerName: "User Assignment",
      field: "submenu_id",
      renderCell: (params) => [
        <IconButton label="User Assignment" onClick={() => handleOpen(params)}>
          <NearMeTwoToneIcon />
        </IconButton>,
      ],
    },
    {
      field: "modified_date",
      headerName: "Roles",
      renderCell: (params) => {
        return (
          <IconButton onClick={() => roleList(params.row)}>
            <AssignmentIndRoundedIcon />
          </IconButton>
        );
      },
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <Link to={`/SubmenuUpdate/${params.row.id}`}>
            <IconButton>
              <EditIcon />
            </IconButton>
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  return (
    <>
      <ModalWrapper
        open={wrapperOpen}
        title={modalData.submenu_name}
        maxWidth={500}
        setOpen={setWrapperOpen}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={12}>
              <Typography style={{ fontSize: "16px", fontWeight: "bold" }}>
                Role List
              </Typography>
              <List>
                {role.length > 0
                  ? role.map((key, index) => {
                      return (
                        <ListItemText key={index}>{key.role_name}</ListItemText>
                      );
                    })
                  : "No Records"}
              </List>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <ModalWrapper
        open={open}
        maxWidth={1000}
        setOpen={setOpen}
        title={submenuName}
      >
        <Box component="form">
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CheckboxAutocomplete
                name="userIds"
                label="Users"
                value={values.userIds}
                options={userOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                errors={["This field is required"]}
                checks={[values.userIds.length > 0]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                onClick={postUserDetails}
              >
                ASSIGN
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
};

export default SubmenuIndex;
