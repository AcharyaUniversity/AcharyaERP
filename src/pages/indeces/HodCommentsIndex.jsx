import { useState, useEffect, lazy } from "react";
import axios from "../../services/Api";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  Button,
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ModalWrapper from "../../components/ModalWrapper";
import CommentIcon from "@mui/icons-material/Comment";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";
import moment from "moment";

const GridIndex = lazy(() => import("../../components/GridIndex"));
const CandidateDetailsView = lazy(() =>
  import("../../components/CandidateDetailsView")
);

const initValues = { comments: "" };

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function HodComments() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [values, setValues] = useState(initValues);
  const [rowData, setRowData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser")).userId;
  const userName = JSON.parse(
    sessionStorage.getItem("AcharyaErpUser")
  ).userName;

  useEffect(() => {
    setCrumbs([{ name: "Job Profile" }]);
    getData();
  }, []);

  const columns = [
    { field: "reference_no", headerName: "Reference No", flex: 1 },
    {
      field: "firstname",
      headerName: "Applicant",
      flex: 1,
      renderCell: (params) => (
        <HtmlTooltip title={params.row.firstname.toLowerCase()}>
          <Typography
            variant="subtitle2"
            onClick={() => handleDetails(params)}
            sx={{
              color: "primary.main",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {params.row.firstname.toLowerCase()}
          </Typography>
        </HtmlTooltip>
      ),
    },
    {
      field: "resume_headline",
      headerName: "Resume Headline",
      flex: 1,
    },
    {
      field: "key_skills",
      headerName: "Key Skills",
      flex: 1,
    },
    {
      field: "interview_date",
      headerName: "Interview Date",
      flex: 1,
      valueGetter: (value, row) => row?.only_date,
    },

    {
      field: "interviewer_comments",
      headerName: "Comment",
      flex: 1,
      renderCell: (params) =>
        params.row.interviewer_comments !== null ? (
          <HtmlTooltip title={params.row.interviewer_comments}>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {params.row.interviewer_comments}
            </span>
          </HtmlTooltip>
        ) : new Date(moment(new Date()).format("YYYY-MM-DD")) >=
          new Date(params?.row.only_date.split("-").reverse().join("-")) ? (
          <IconButton
            style={{ color: "#4A57A9", textAlign: "center" }}
            onClick={() => handleComments(params)}
          >
            <CommentIcon />
          </IconButton>
        ) : (
          ""
        ),
    },
  ];

  const getData = async () =>
    await axios
      .get(`/api/employee/jobProfileDetailsOnUserId/${userId}`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((err) => console.error(err));

  const handleDetails = async (params) => {
    setRowData(params.row);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleComments = async (params) => {
    setRowData(params.row);

    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${params.row.id}`)
      .then((res) => {
        const data = res.data.data.filter(
          (a) => a.username.toLowerCase() === userName.toLowerCase()
        );

        if (data.length > 0) {
          setValues((prev) => ({
            ...prev,
            ["comments"]: data[0].interviewer_comments,
            ["email"]: data[0].email,
          }));
        }
      })
      .catch((err) => console.error(err));
    setCommentModalOpen(true);
  };

  const handleCreate = async () => {
    await axios
      .put(
        `/api/employee/setInterviewerCommentsFromApp/${userId}/${rowData.id}/${values.comments}`
      )
      .then((res) => {
        setAlertMessage({
          severity: "success",
          message: "Comments received Successfully",
        });
        setAlertOpen(true);
        setCommentModalOpen(false);
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box sx={{ position: "relative", mt: 3 }}>
      <ModalWrapper open={modalOpen} setOpen={setModalOpen} maxWidth={1200}>
        <CandidateDetailsView id={rowData.id} />
      </ModalWrapper>

      <ModalWrapper
        open={commentModalOpen}
        setOpen={setCommentModalOpen}
        maxWidth={500}
        title={
          <p style={{ textTransform: "capitalize" }}>
            {rowData.firstname + " ( " + rowData.reference_no + " )"}
          </p>
        }
      >
        <Grid container rowSpacing={2} p={3}>
          <Grid item xs={12}>
            <CustomTextField
              name="comments"
              label="Comments"
              value={values.comments}
              multiline
              rows={7}
              inputProps={{ maxLength: 300 }}
              handleChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleCreate}
              disabled={!values.comments}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>

      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default HodComments;
