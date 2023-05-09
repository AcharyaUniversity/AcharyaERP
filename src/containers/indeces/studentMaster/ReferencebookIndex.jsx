import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

function ReferencebookIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    {
      field: "concatenated_program_specialization",
      headerName: "Major",
      flex: 1,
      hide: true,
    },
    {
      field: "title_of_book",
      headerName: "Title",
      flex: 4,
      width: 220,
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="subtitle2"
              component="span"
              color="primary.main"
              sx={{ cursor: "pointer" }}
              onClick={() => handleDetails(params)}
            >
              {params.row.title_of_book}
            </Typography>
          </Box>
        );
      },
    },
    { field: "author", headerName: "Author", flex: 1 },
    { field: "edition", headerName: "Edition", flex: 1 },
    { field: "yr_of_Publish", headerName: "Year of publish", flex: 1 },
    { field: "publisher_details", headerName: "Publisher details", flex: 1 },
    { field: "available_books", headerName: "Count", flex: 0.5 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
      hide: true,
    },
    {
      field: "created_by",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/StudentMaster/ReferencebookForm/Update/${params.row.id}`)
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

  const getData = async () => {
    await axios(
      `/api/academic/ReferenceBooks?page=${0}&page_size=${10000}&sort=created_date`
    )
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/ReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateReferenceBooks/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
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
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        })
      : setModalContent({
          title: "Activate",
          message: "Do you want to make it Active?",
          buttons: [
            { name: "No", color: "primary", func: () => {} },
            { name: "Yes", color: "primary", func: handleToggle },
          ],
        });
  };

  const handleDetails = async (params) => {
    await axios
      .get(`/api/academic/ReferenceBooksDetails/${params.row.id}`)
      .then((res) => {
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
    setDetailsOpen(true);
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
      <ModalWrapper open={detailsOpen} setOpen={setDetailsOpen} maxWidth={800}>
        <Box sx={{ mt: 3 }}>
          <Grid container rowSpacing={1.5}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" className={classes.bg}>
                Reference Book Details
              </Typography>
            </Grid>
            <Grid item xs={12} component={Paper} elevation={3} mt={1} p={2}>
              <Grid container rowSpacing={1}>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.school_name_short}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Specialization</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.program_specialization_short_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Course</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.course_short_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Title</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.title_of_book}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Author</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.author}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Edition</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.edition}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">Publisher Details</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.publisher_details}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={1.5}>
                  <Typography variant="subtitle2">ISBN Code</Typography>
                </Grid>
                <Grid item xs={12} md={4.5}>
                  <Typography variant="body2" color="textSecondary">
                    {data.reference_code}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 7 }}>
        <Button
          onClick={() => navigate("/StudentMaster/ReferencebookForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default ReferencebookIndex;
