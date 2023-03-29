import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Grid,
  styled,
  tableCellClasses,
  TableCell,
  TableHead,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function SchoolVisionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisionOpen, setModalVisionOpen] = useState(false);
  const [programVision, setProgramVision] = useState(null);
  const [programMission, setProgramMission] = useState(null);

  const navigate = useNavigate();

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 0.5 },

    {
      field: "view",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton onClick={() => handleView(params)}>
          <VisibilityIcon />
        </IconButton>,
      ],
    },
    { field: "createdUsername", headerName: "Created By", flex: 1 },

    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.createdDate),
    },

    {
      field: "id",
      type: "actions",
      flex: 0.5,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/InstituteMaster/SchoolVision/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },

    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];
  useEffect(() => {
    getData();
  }, []);

  const handleView = (params) => {
    setModalVisionOpen(true);
    setProgramVision(params.row.asvVision);
    setProgramMission(params.row.asvMission);
  };

  const getData = async () => {
    await axios
      .get(
        `/api/academic/academicSchoolVision?page=0&page_size=10&sort=createdDate`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/academicSchoolVision/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateAcademicSchoolVision/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "Deactivate",
          message: "Do you want to make it Inactive?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box sx={{ position: "relative", mt: 2 }}>
        <Button
          onClick={() => navigate("/InstituteMaster/SchoolVision/New")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
        <ModalWrapper
          maxWidth={800}
          open={modalVisionOpen}
          setOpen={setModalVisionOpen}
        >
          <Box
            component="span"
            sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
          >
            <Grid container justifyContent="flex-start" columnGap={8} ml={-6}>
              <Grid item xs={12} md={6}>
                <Card sx={{ minWidth: 400, minHeight: 200 }} elevation={4}>
                  <TableHead>
                    <StyledTableCell
                      sx={{
                        width: 500,
                        textAlign: "center",
                        fontSize: 18,
                        padding: "10px",
                      }}
                    >
                      Vision
                    </StyledTableCell>
                  </TableHead>
                  <CardContent>
                    <Typography sx={{ fontSize: 16 }}>
                      {programVision}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ minWidth: 400, minHeight: 200 }}>
                  <TableHead>
                    <StyledTableCell
                      sx={{
                        width: 500,
                        textAlign: "center",
                        fontSize: 18,
                        padding: "10px",
                      }}
                    >
                      Mission
                    </StyledTableCell>
                  </TableHead>
                  <CardContent>
                    <CardActions>
                      <Typography sx={{ marginTop: -1, fontSize: 16 }}>
                        {programMission}
                      </Typography>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </ModalWrapper>
      </Box>
    </>
  );
}
export default SchoolVisionIndex;
