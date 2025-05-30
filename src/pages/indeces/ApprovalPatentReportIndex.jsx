import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { Box, IconButton, Grid, Typography, Badge } from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useAlert from "../../hooks/useAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from "react-router-dom";
import ModalWrapperIncentive from "../../components/ModalWrapperIncentive";
import ModalWrapper from "../../components/ModalWrapper";
import { GenerateApprovalIncentiveReport } from "./GenerateApprovalIncentiveReport";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import moment from "moment";


function ApprovalPatentIndex() {
  const [rows, setRows] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [reportPath, setReportPath] = useState(null);
  const [timeLineList, setTimeLineList] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    reference_number: false,
    publication_status: false
  });

  const columns = [
     {
       field: "",
       headerName: "Application Status",
       flex: 1,
       renderCell: (params) => (
        <IconButton
        disabled={params.row.approver_status == false}
          sx={{ padding: 0, color: "primary.main" }}
        >
        <DownloadIcon color={params.row.approver_status == false ? "secondary":"primary"} onClick={()=>onClickPrint(params)}/>
        </IconButton>
      ),
     },
     {
       field: "empcode",
       headerName: "Emp Code",
       flex: 1,
     },
     {
       field: "employee_name",
       headerName: " Name",
       flex: 1,
     },
     {
       field: "dept_name_short",
       headerName: "Department",
       flex: 1,
     },
     {
       field: "experience",
       headerName: "Exp. at Acharya",
       flex: 1,
     },
    {
      field: "date",
      headerName: "Applied Date",
      flex: 1,
      renderCell: (params) => (
        params.row.date ?  moment(params.row.date).format("DD-MM-YYYY") : "-"
      )
    },
     { field: "patent_name", headerName: "National / International", flex: 1 },
     { field: "patent_title", headerName: "Patent Title", flex: 1 },
     {
       field: "reference_number",
       headerName: "Reference No.",
       flex: 1,
     },
     {
       field: "publication_status",
       headerName: "Publication Status",
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
             color={!!params.row?.incentive_approver_id ? "primary" : "secondary"}
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
        <div style={{ textAlign: "center", marginLeft: "24px" }}>
          <Badge badgeContent={params.row.approver_status == false ? "Rejected":"Completed"}
            color={params.row.approver_status == false ? "error": "success"}>
          </Badge>
        </div>
      ),
    },
   ]


   useEffect(() => {
    getData();
  }, []);

   const onClickPrint = async(rowData)=> {
    const employeeDetail = await getUserDetails(rowData.row?.emp_id);
    const employeeImageUrl = await getUserImage(employeeDetail?.emp_image_attachment_path);
    const patentTimeLineData = await getPatentTimeLineData(rowData.row?.emp_id,rowData.row?.incentive_approver_id,rowData);
    let list = {
      "researchType":"patent",
      "rowData":rowData['row'],
      "employeeDetail":employeeDetail,
      "employeeImageUrl":employeeImageUrl,
      "timeLineData":patentTimeLineData
    };
    const reportResponse = await GenerateApprovalIncentiveReport(list);
    if (!!reportResponse) {
      setReportPath(URL.createObjectURL(reportResponse));
      setPrintModalOpen(true);
    }  
  };

  const getUserDetails = async (empId) => {
    try {
      const res = await axios.get(`/api/employee/EmployeeDetails/${empId}`);
      if (res?.status == 200 || res?.status == 201) {
        return  res.data.data[0];
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

  const getUserImage = async (photoAttachmentPath) => {
    try {
        const res = await axios.get(
          `/api/employee/employeeDetailsFileDownload?fileName=${photoAttachmentPath}`,
          { responseType: "blob" }
        );
        if (
          res.status === 200 ||
          res.status === 201
        ) {
          return URL.createObjectURL(res.data);
        }
    } catch (error) {
      console.log("imageError", error);
    }
  };

    const getPatentTimeLineData = async (empId,incentiveId,rowValue) => {
      try {
        let timeLineLists = [];
        const response = await axios.get(
          `/api/employee/getApproverDetailsData/${empId}`
        );
        if (response?.status == 200 || response?.status == 201) {
          if (incentiveId) {
            const res = await axios.get(
              `/api/employee/incentiveApproverBasedOnEmpId/${empId}/${incentiveId}`
            );
            if (res?.status == 200 || res?.status == 201) {
              if (response.data.data[0]?.hoiName === response.data.data[1]?.hodName) {
                timeLineLists = [
                  {
                    date: res.data.data[0]?.date,
                    type: "Applicant",
                    note: res.data.data[0]?.remark,
                    name: rowValue?.row?.employee_name,
                    status: res.data.data[0]?.status,
                    weight: "10",
                    ipAddress: res.data.data[0]?.ip_address
                  },
                  {
                    date: res.data.data[0]?.hod_date,
                    type: "Head of Department",
                    note: res.data.data[0]?.hod_remark,
                    name: res.data.data[0]?.hod_name,
                    status: res.data.data[0]?.hod_status,
                    weight: "20",
                    ipAddress: res.data.data[0]?.hod_ip_address
                  },
                  {
                    date: res.data.data[0]?.hod_date,
                    type: "Reporting Manager",
                    note: res.data.data[0]?.hod_remark,
                    name: res.data.data[0]?.hod_name,
                    status: res.data.data[0]?.hod_status,
                    weight: "30",
                    ipAddress: res.data.data[0]?.hod_ip_address
                  },
                  {
                    date: res.data.data[0]?.ipr_date,
                    type: "IPR Head",
                    note: res.data.data[0]?.ipr_remark,
                    name: res.data.data[0]?.ipr_name,
                    status: res.data.data[0]?.ipr_status,
                    weight: "40",
                    ipAddress: res.data.data[0]?.ipr_ip_address
                  },
                  {
                    date: res.data.data[0]?.asst_dir_date,
                    type: "Assistant Director R & D",
                    note: res.data.data[0]?.asst_dir_remark,
                    name: res.data.data[0]?.asst_dir_name,
                    status: res.data.data[0]?.asst_dir_status,
                    weight: "",
                    ipAddress: res.data.data[0]?.asst_ip_address
                  },
                  {
                    date: res.data.data[0]?.qa_date,
                    type: "Head QA",
                    note: res.data.data[0]?.qa_remark,
                    name: res.data.data[0]?.qa_name,
                    amount: res.data?.data[0]?.amount,
                    status: res.data.data[0]?.qa_status,
                    weight: "60",
                    ipAddress: res.data.data[0]?.qa_ip_address
                  },
                  {
                    date: res.data.data[0]?.hr_date,
                    type: "Human Resources",
                    note: res.data.data[0]?.hr_remark,
                    name: res.data.data[0]?.hr_name,
                    status: res.data.data[0]?.hr_status,
                    weight: "80",
                    ipAddress: res.data.data[0]?.hr_ip_address
                  },
                  {
                    date: res.data.data[0]?.finance_date,
                    type: "Finance",
                    note: res.data.data[0]?.finance_remark,
                    name: res.data.data[0]?.finance_name,
                    status: res.data.data[0]?.finance_status,
                    weight: "100",
                    ipAddress: res.data.data[0]?.finance_ip_address
                  },
                ];
              } else {
                timeLineLists = [
                  {
                    date: res.data.data[0]?.date,
                    type: "Applicant",
                    note: res.data.data[0]?.remark,
                    name: rowValue?.row?.employee_name,
                    status: res.data.data[0]?.status,
                    weight: "10",
                    ipAddress: res.data.data[0]?.ip_address
                  },
                  {
                    date: res.data.data[0]?.hod_date,
                    type: "Head of Department",
                    note: res.data.data[0]?.hod_remark,
                    name: res.data.data[0]?.hod_name,
                    status: res.data.data[0]?.hod_status,
                    weight: "20",
                    ipAddress: res.data.data[0]?.hod_ip_address
                  },
                  {
                    date: res.data.data[0]?.hoi_date,
                    type: "Reporting Manager",
                    note: res.data.data[0]?.hoi_remark,
                    name: res.data.data[0]?.hoi_name,
                    status: res.data.data[0]?.hoi_status,
                    weight: "30",
                    ipAddress: res.data.data[0]?.hoi_ip_address
                  },
                  {
                    date: res.data.data[0]?.ipr_date,
                    type: "IPR Head",
                    note: res.data.data[0]?.ipr_remark,
                    name: res.data.data[0]?.ipr_name,
                    status: res.data.data[0]?.ipr_status,
                    weight: "40",
                    ipAddress: res.data.data[0]?.ipr_ip_address
                  },
                  {
                    date: res.data.data[0]?.asst_dir_date,
                    type: "Assistant Director R & D",
                    note: res.data.data[0]?.asst_dir_remark,
                    name: res.data.data[0]?.asst_dir_name,
                    status: res.data.data[0]?.asst_dir_status,
                    weight: "",
                    ipAddress: res.data.data[0]?.asst_ip_address
                  },
                  {
                    date: res.data.data[0]?.qa_date,
                    type: "Head QA",
                    note: res.data.data[0]?.qa_remark,
                    name: res.data.data[0]?.qa_name,
                    amount: res.data?.data[0]?.amount,
                    status: res.data.data[0]?.qa_status,
                    weight: "60",
                    ipAddress: res.data.data[0]?.qa_ip_address
                  },
                  {
                    date: res.data.data[0]?.hr_date,
                    type: "Human Resources",
                    note: res.data.data[0]?.hr_remark,
                    name: res.data.data[0]?.hr_name,
                    status: res.data.data[0]?.hr_status,
                    weight: "80",
                    ipAddress: res.data.data[0]?.hr_ip_address
                  },
                  {
                    date: res.data.data[0]?.finance_date,
                    type: "Finance",
                    note: res.data.data[0]?.finance_remark,
                    name: res.data.data[0]?.finance_name,
                    status: res.data.data[0]?.finance_status,
                    weight: "100",
                    ipAddress: res.data.data[0]?.finance_ip_address
                  },
                ];
              }
              return timeLineLists;
            }
        };
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

  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios
        .get(
          `api/employee/patentBasedOnEmpId`
        );
      if (res.status == 200 || res.status == 201) {
        setLoading(false);
        setRows(res.data.data?.filter((ele) =>
           !!(ele.status && ele.hod_status && ele.hoi_status && ele.hr_status && ele.asst_dir_status && ele.qa_status && ele.finance_status && ele.ipr_status) || ele.approver_status == false));
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  };

   const handleDownload = async (path) => {
     await axios
       .get(`/api/employee/patentFileviews?fileName=${path}`, {
         responseType: "blob",
       })
       .then((res) => {
         const url = URL.createObjectURL(res.data);
         window.open(url);
       })
       .catch((err) => console.error(err));
   };

   const handleFollowUp = async (params) => {
     try {
       setModalOpen(!modalOpen);
       let timeLineLists = [];
       const response = await axios.get(
         `/api/employee/getApproverDetailsData/${params.row?.emp_id}`
       );
       if (response?.status == 200 || response?.status == 201) {
         if (!!params.row?.incentive_approver_id) {
           const res = await axios.get(
             `/api/employee/incentiveApproverBasedOnEmpId/${params.row?.emp_id}/${params.row?.incentive_approver_id}`
           );
           if (res?.status == 200 || res?.status == 201) {
             if(response.data.data[0]?.hoiName === response.data.data[1]?.hodName){
           timeLineLists = [
              {
                date: res.data.data[0]?.date,
                type: "Initiated By",
                note: res.data.data[0]?.remark,
                name: res.data.data[0]?.created_username,
                status: res.data.data[0]?.status,
                weight:"10"
              },
              {
                date: res.data.data[0]?.hod_date,
                type: "Head of Department",
                note: res.data.data[0]?.hod_remark,
                name: res.data.data[0]?.hod_name,
                status: res.data.data[0]?.hod_status,
                weight:"20"
              },
              {
                date: res.data.data[0]?.hod_date,
                type: "Head of Institute",
                note: res.data.data[0]?.hod_remark,
                name: res.data.data[0]?.hod_name,
                status: res.data.data[0]?.hod_status,
                weight:"30"
              },
              {
                date: res.data.data[0]?.ipr_date,
                type: "IPR Head",
                note: res.data.data[0]?.ipr_remark,
                name: res.data.data[0]?.ipr_name,
                status: res.data.data[0]?.ipr_status,
                weight:"40"
              },
              {
                date: res.data.data[0]?.asst_dir_date,
                type: "Assistant Director R & D",
                note: res.data.data[0]?.asst_dir_remark,
                name: res.data.data[0]?.asst_dir_name,
                status: res.data.data[0]?.asst_dir_status,
                weight:""
              },
              {
                date: res.data.data[0]?.qa_date,
                type: "Quality Assurance",
                note: res.data.data[0]?.qa_remark,
                name: res.data.data[0]?.qa_name,
                amount: res.data?.data[0]?.amount,
                status: res.data.data[0]?.qa_status,
                weight:"60"
              },
              {
                date: res.data.data[0]?.hr_date,
                type: "Human Resources",
                note: res.data.data[0]?.hr_remark,
                name: res.data.data[0]?.hr_name,
                status: res.data.data[0]?.hr_status,
                weight:"80"
              },
              {
                date: res.data.data[0]?.finance_date,
                type: "Finance",
                note: res.data.data[0]?.finance_remark,
                name: res.data.data[0]?.finance_name,
                status: res.data.data[0]?.finance_status,
                weight:"100"
              },
            ];
             }else {
            timeLineLists = [
              {
                date: res.data.data[0]?.date,
                type: "Initiated By",
                note: res.data.data[0]?.remark,
                name: res.data.data[0]?.created_username,
                status: res.data.data[0]?.status,
                weight:"10"
              },
              {
                date: res.data.data[0]?.hod_date,
                type: "Head of Department",
                note: res.data.data[0]?.hod_remark,
                name: res.data.data[0]?.hod_name,
                status: res.data.data[0]?.hod_status,
                weight:"20"
              },
              {
                date: res.data.data[0]?.hoi_date,
                type: "Head of Institute",
                note: res.data.data[0]?.hoi_remark,
                name: res.data.data[0]?.hoi_name,
                status: res.data.data[0]?.hoi_status,
                weight:"30"
              },
              {
                date: res.data.data[0]?.ipr_date,
                type: "IPR Head",
                note: res.data.data[0]?.ipr_remark,
                name: res.data.data[0]?.ipr_name,
                status: res.data.data[0]?.ipr_status,
                weight:"40"
              },
              {
                date: res.data.data[0]?.asst_dir_date,
                type: "Assistant Director R & D",
                note: res.data.data[0]?.asst_dir_remark,
                name: res.data.data[0]?.asst_dir_name,
                status: res.data.data[0]?.asst_dir_status,
                weight:""
              },
              {
                date: res.data.data[0]?.qa_date,
                type: "Quality Assurance",
                note: res.data.data[0]?.qa_remark,
                name: res.data.data[0]?.qa_name,
                amount: res.data?.data[0]?.amount,
                status: res.data.data[0]?.qa_status,
                weight:"60"
              },
              {
                date: res.data.data[0]?.hr_date,
                type: "Human Resources",
                note: res.data.data[0]?.hr_remark,
                name: res.data.data[0]?.hr_name,
                status: res.data.data[0]?.hr_status,
                weight:"80"
              },
              {
                date: res.data.data[0]?.finance_date,
                type: "Finance",
                note: res.data.data[0]?.finance_remark,
                name: res.data.data[0]?.finance_name,
                status: res.data.data[0]?.finance_status,
                weight:"100"
              },
            ];
             }
             setTimeLineList(timeLineLists);
           }
       };
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
      <ModalWrapperIncentive
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={900}
        title={"Incentive TimeLine"}
        headerText={"The number shown below represents the percentage"}
      >
        <Box>
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
                          {obj.weight ? <TimelineDot color="error">
                            <Typography sx={{ color: "white" }}>{obj.weight}</Typography>
                          </TimelineDot> :
                            <TimelineDot>
                              <CircleIcon color="error" />
                            </TimelineDot>
                          }
                          {index < timeLineList.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                      )}
                      {!!(obj.date && obj.status) && (
                        <TimelineSeparator>
                          {obj.weight ? <TimelineDot color="success">
                            <Typography sx={{ color: "white" }}>{obj.weight}</Typography>
                          </TimelineDot> :
                            <TimelineDot>
                              <CheckCircleIcon color="success" />
                            </TimelineDot>
                          }
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
      </ModalWrapperIncentive> 
      <ModalWrapper
        open={printModalOpen}
        setOpen={setPrintModalOpen}
        maxWidth={1000}
        title={""}
      >
        <Box borderRadius={3}>
          {!!reportPath && (
            <object
              data={reportPath}
              type="application/pdf"
              style={{ height: "450px", width: "100%" }}
            >
              <p>
                Your web browser doesn't have a PDF plugin. Instead you can
                download the file directly.
              </p>
            </object>
          )}
        </Box>
      </ModalWrapper>   
        <Box
          sx={{
            position:"relative",
            marginTop: { xs: 10, md: 1 },
          }}
        >
          <Box sx={{ position: "absolute", width: "100%",  }}>
            <GridIndex rows={rows} columns={columns} loading={loading} 
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel}/>
          </Box>
        </Box>
    </>
  );
}
export default ApprovalPatentIndex;

