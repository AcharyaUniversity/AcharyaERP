import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton, Grid, Typography,Badge } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../../components/ModalWrapper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import moment from "moment";

const empId = sessionStorage.getItem("empId");

function PublicationReport() {
  const [rows, setRows] = useState([]);
  const [isApprover, setIsApprover] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLineList, setTimeLineList] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      field: "",
      headerName: "Application Status",
      flex: 1,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleIncentive(params)}
          disabled={(!!params.row?.status  && params.row?.approver_status !=null && params.row?.approver_status == false && params.row?.approved_status === null)}
          sx={{ padding: 0, color: "primary.main" }}
        >
          <PlaylistAddIcon sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    },
    { field: "Type", headerName: " Type", flex: 1 },
    { field: "journal_name", headerName: "Journal Name", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      hide: !!isApprover ? true : false,
    },
    {
      field: "volume",
      headerName: "Volume",
      flex: 1,
    },
    {
      field: "issue_number",
      headerName: "Issue Number",
      flex: 1,
    },

    {
      field: "paper_title",
      headerName: "Paper Title",
      flex: 1,
    },
    {
      field: "page_number",
      headerName: "Paper Number",
      flex: 1,
    },
    {
      field: "issn",
      headerName: "ISSN",
      flex: 1,
    },
    {
      field: "issn_type",
      headerName: "ISSN Type",
      flex: 1,
    },
    {
      field: "attachment_path",
      type: "actions",
      flex: 1,
      headerName: "View",
      getActions: (params) => [
        params.row.attachment_path ? (
          <IconButton
            onClick={() => handleDownload(params.row.attachment_path)}
            sx={{ padding: 0 }}
          >
            <VisibilityIcon
              fontSize="small"
              color="primary"
              sx={{ cursor: "pointer" }}
            />
          </IconButton>
        ) : (
          <></>
        ),
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "TimeLine",
      getActions: (params) => [
        <IconButton
        disabled={!params.row?.incentive_approver_id}
         onClick={() => handleFollowUp(params)} sx={{ padding: 0 }}>
          <NoteAddIcon
            fontSize="small"
            color={!!params.row?.incentive_approver_id ? "primary": "secondary"}
            sx={{ cursor: "pointer" }}
          />
        </IconButton>,
      ],
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        !(params.row?.status === null) && <div style={{textAlign:"center",marginLeft:"24px"}}>
        <Badge badgeContent= {(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status===null) && params.row?.approved_status ===null) ? "In-progress" : (!!params.row?.status  && !params.row?.approver_status && params.row?.approved_status === null) ? "Rejected":(!!params.row?.status  && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "Completed":""}
         color={(!!params.row?.status && (!!params.row?.approver_status || params.row?.approver_status===null) && params.row?.approved_status ===null) ? "secondary" : (!!params.row?.status  && !params.row?.approver_status && params.row?.approved_status === null) ? "error": (!!params.row?.status  && !!params.row?.approver_status && params.row?.approved_status == "All Approved") ? "success":""}>
        </Badge>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData(empId);
  }, []);

  const getData = async (empId) => {
    await axios
      .get(`/api/employee/publicationDetailsBasedOnEmpId/${empId}?percentageFilter=10`)
      .then((res) => {
        setRows(res.data.data);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response
            ? error.response.data.message
            : "An error occured !!",
        });
        setAlertOpen(true);
      });
  };

  const handleDownload = async (path) => {
    await axios
      .get(`/api/employee/publicationsFileviews?fileName=${path}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleIncentive = (params) => {
    navigate("/addon-incentive-application", {
      state: {
        isApprover: false,
        tabName: "PUBLICATION",
        rowData: params.row,
        urlName:"/AddonReport"
      },
    });
  };

  const handleFollowUp = async (params) => {
    try {
      setModalOpen(!modalOpen);
      if (!!params.row?.incentive_approver_id) {
        const res = await axios.get(
          `/api/employee/incentiveApproverBasedOnEmpId/${params.row?.emp_id}/${params.row?.incentive_approver_id}`
        );
        if (res?.status == 200 || res?.status == 201) {
          const timeLineLists = [
            {
              date: res.data.data[0]?.date,
              type: "Initiated By",
              note: res.data.data[0]?.remark,
              name: res.data.data[0]?.created_username,
              status: res.data.data[0]?.status,
            },
            {
              date: res.data.data[0]?.hod_date,
              type: "Head of Department",
              note: res.data.data[0]?.hod_remark,
              name: res.data.data[0]?.hod_name,
              status: res.data.data[0]?.hod_status,
            },
            {
              date: res.data.data[0]?.hoi_date,
              type: "Head of Institute",
              note: res.data.data[0]?.hoi_remark,
              name: res.data.data[0]?.hoi_name,
              status: res.data.data[0]?.hoi_status,
            },
            {
              date: res.data.data[0]?.asst_dir_date,
              type: "Assistant Director R & D",
              note: res.data.data[0]?.asst_dir_remark,
              name: res.data.data[0]?.asst_dir_name,
              status: res.data.data[0]?.asst_dir_status,
            },
            {
              date: res.data.data[0]?.qa_date,
              type: "Quality Assurance",
              note: res.data.data[0]?.qa_remark,
              name: res.data.data[0]?.qa_name,
              amount: res.data?.data[0]?.amount,
              status: res.data.data[0]?.qa_status,
            },
            {
              date: res.data.data[0]?.hr_date,
              type: "Human Resources",
              note: res.data.data[0]?.hr_remark,
              name: res.data.data[0]?.hr_name,
              status: res.data.data[0]?.hr_status,
            },
            {
              date: res.data.data[0]?.finance_date,
              type: "Finance",
              note: res.data.data[0]?.finance_remark,
              name: res.data.data[0]?.finance_name,
              status: res.data.data[0]?.finance_status,
            },
          ];
          setTimeLineList(timeLineLists);
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={800}
        title={"Incentive TimeLine"}
      >
             <Box p={1}>
          <Grid container>
            <Grid xs={12}>
              <Timeline>
                {!!timeLineList.length &&
                  timeLineList.map((obj, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="textSecondary">
                        <Typography>
                          {!!obj.date ? moment(obj.date).format("lll") : ""}
                        </Typography>
                        <Typography sx={{ fontWeight: "500" }}>
                          {obj.name}
                        </Typography>
                        <Typography>{obj.type}</Typography>
                      </TimelineOppositeContent>
                      {!(obj.date && obj.status) && (
                        <TimelineSeparator>
                          <TimelineDot>
                            <CircleIcon color="error" />
                          </TimelineDot>
                          {index < timeLineList.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                      )}
                      {!!(obj.date && obj.status) && (
                        <TimelineSeparator>
                          <TimelineDot>
                            <CheckCircleIcon color="success" />
                          </TimelineDot>
                          {index < timeLineList.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                      )}
                      <TimelineContent>
                        <Typography>
                          <span style={{ fontWeight: "500" }}>Remark</span> :-{" "}
                          {obj.note}
                        </Typography>
                        {!!obj.amount && (
                          <Typography>
                            <span style={{ fontWeight: "500" }}>Amount</span> -{" "}
                            {obj.amount}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
              </Timeline>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 2 }}>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default PublicationReport;
