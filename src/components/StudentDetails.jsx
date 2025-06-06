import { useState, useEffect } from "react";
import axios from "../services/Api";
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  tooltipClasses,
  styled,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import reportingStatus from "../utils/ReportingStatus";
import { Cancel } from "@mui/icons-material";

const bookmanFont = {
  fontFamily: "Roboto",
  fontSize: "13px !important",
};

const bookmanFontLabel = {
  fontFamily: "Roboto",
  fontSize: "13px !important",
  fontWeight: "bold",
};

const bookmanFontPrint = {
  fontFamily: "Roboto",
  color: "black",
  fontSize: "20px !important",
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: "100%",
    padding: "10px",
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    // padding: theme.spacing(1),
    // textAlign: "justify",
  },
}));

function StudentDetails({
  id,
  isStudentdataAvailable = () => {},
  header = "",
  isPrintClick = false,
}) {
  const [studentData, setStudentData] = useState(null);
  const [cancel, setCancel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
    getCancelData();
  }, [id]);

  const getData = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(id);
      const baseUrl = "/api/student/getStudentDetailsBasedOnAuidAndStrudentId";
      const url = `${baseUrl}?${
        containsAlphabetic ? "auid" : "student_id"
      }=${id}`;

      const response = await axios.get(url);
      // const cancelresponse = await axios.get(
      //   `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      // );
      // setCancel(cancelresponse?.data?.data?.cancelAdmissions?.[0]);

      setStudentData(response.data.data[0]);
      isStudentdataAvailable(response.data.data[0]);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
      isStudentdataAvailable({});
    } finally {
      setLoading(false);
    }
  };

  const getCancelData = async () => {
    try {
      setLoading(true);
      const containsAlphabetic = /[a-zA-Z]/.test(id);

      if (!containsAlphabetic) {
        const cancelresponse = await axios.get(
          `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
        );
        setCancel(cancelresponse?.data?.data?.cancelAdmissions?.[0]);
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to fetch student details. Please try again later.");
      isStudentdataAvailable({});
    } finally {
      setLoading(false);
    }
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;

    return (
      number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
    );
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={2} lg={1.5}>
          <Typography variant="subtitle2" sx={bookmanFontLabel}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={4.5}>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={bookmanFont}
          >
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  if (loading) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        Loading ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        variant="subtitle2"
        color="error"
        sx={{ textAlign: "center" }}
      >
        {error}
      </Typography>
    );
  }

  if (!studentData) {
    return (
      <HtmlTooltip
        title={
          <>
            <Typography color="inherit">
              <strong>Requested By :</strong> {cancel?.created_username}
            </Typography>
            <Typography color="inherit">
              <strong>Cancelled Date :</strong>{" "}
              {moment(cancel?.approved_date).format("DD-MM-YYYY")}
            </Typography>
            <Typography color="inherit">
              <strong>Requested By Remarks :</strong> {cancel?.remarks}
            </Typography>
            <Typography color="inherit">
              <strong>Approved By Remarks :</strong> {cancel?.approved_remarks}
            </Typography>
          </>
        }
      >
        <Typography
          variant="subtitle2"
          color="error"
          sx={{ textAlign: "center", marginBottom: 2, cursor: "pointer" }}
        >
          Admission is cancelled !!!
        </Typography>
      </HtmlTooltip>
    );
  }

  const handleAuid = (auid) => {
    navigate(`/student-ledger/${auid}`);
  };

  return header ? (
    <>
      <Box
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "tableBg.main",
            color: "tableBg.textColor",
            textAlign: "center",
            p: 1,
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={isPrintClick ? bookmanFontPrint : bookmanFont}
          >
            {header ? header : "Student Details"}
          </Typography>
        </Box>

        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                AUID
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.auid || ""}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Student Name
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.student_name || ""}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                USN
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "12px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.usn ?? ""}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                DOA
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.date_of_admission
                    ? moment(studentData.date_of_admission).format("DD-MM-YYYY")
                    : ""}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Program
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.program_short_name} -{" "}
                  {studentData.program_specialization_short_name}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Academic Batch
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.academic_batch || ""}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Current Year/Sem
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.current_year}/{studentData.current_sem} -{" "}
                  {studentData.section_name}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Fee Template
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.fee_template_name}
                  {studentData?.program_type_name?.toLowerCase() === "semester"
                    ? "S"
                    : "Y"}{" "}
                  - {studentData.fee_template_id}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Nationality
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.nationalityName || ""}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Admission Category
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.fee_admission_category_short_name} -{" "}
                  {studentData.fee_admission_sub_category_short_name}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Acharya Email
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.acharya_email || ""}
                </span>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                }}
              >
                Mobile No.
              </TableCell>
              <TableCell sx={isPrintClick ? bookmanFontPrint : bookmanFont}>
                <span>:</span>
                <span
                  style={{
                    marginLeft: "15px",
                    ...(isPrintClick ? bookmanFontPrint : bookmanFont),
                  }}
                >
                  {studentData.mobile || ""}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </>
  ) : (
    <Grid container>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title="Student Details"
            titleTypographyProps={{
              variant: "subtitle2",
            }}
            sx={{
              backgroundColor: "tableBg.main",
              color: "tableBg.textColor",
              textAlign: "center",
              padding: 1,
            }}
          />
          <CardContent>
            <Grid container columnSpacing={2} rowSpacing={1}>
              <DisplayContent label="AUID" value={studentData.auid} />
              <DisplayContent
                label="Student Name"
                value={studentData.student_name}
              />
              <DisplayContent label="USN" value={studentData.usn ?? "-"} />
              <DisplayContent
                label="DOA"
                value={moment(studentData.date_of_admission).format(
                  "DD-MM-YYYY"
                )}
              />
              {/* <DisplayContent label="School" value={studentData.school_name} /> */}
              <DisplayContent
                label="Program"
                value={`${studentData.program_short_name} - ${studentData.program_specialization_short_name}`}
              />
              <DisplayContent
                label="Academic Batch"
                value={studentData.academic_batch}
              />
              <DisplayContent
                label="Current Year/Sem"
                value={`${studentData.current_year}/${studentData.current_sem} -     ${studentData.section_name} Section`}
              />
              <DisplayContent
                label="Fee Template"
                value={`${studentData.fee_template_name}${
                  studentData?.program_type_name?.toLowerCase() === "semester"
                    ? "S"
                    : "Y"
                } - ${studentData.fee_template_id}`}
              />
              <DisplayContent
                label="Admission Category"
                value={`${studentData.fee_admission_category_short_name} - ${studentData.fee_admission_sub_category_short_name}`}
              />
              <DisplayContent
                label="Nationality"
                value={studentData.nationalityName}
              />
              <DisplayContent
                label="Proctor Name"
                value={studentData.proctorName ?? "-"}
              />
              <DisplayContent
                label="Reporting Status"
                value={reportingStatus[studentData.eligible_reported_status]}
              />
              <DisplayContent
                label="Acharya Email"
                value={studentData.acharya_email}
              />
              <DisplayContent label="Mobile No." value={studentData.mobile} />
              <Grid item xs={12} align="center" mt={2}>
                {studentData.newStudentId ? (
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{ fontSize: 13 }}
                    >
                      {`Student Re-Admitted, Current AUID is `}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      onClick={() => handleAuid(studentData.newAuid)}
                      sx={{
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                        ...bookmanFont,
                      }}
                    >
                      {studentData.newAuid}
                    </Typography>
                  </Box>
                ) : studentData.oldStudentId ? (
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="error"
                      sx={{ fontSize: 13 }}
                    >
                      {`Student Re-Admitted to ${getOrdinalSuffix(
                        studentData.semOrYear
                      )} ${
                        studentData.program_type_name.toLowerCase() ===
                        "semester"
                          ? "Sem"
                          : "Year"
                      } in ${
                        studentData.readmission_ac_year
                      }. Previous AUID is `}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      onClick={() => handleAuid(studentData.oldAuid)}
                      sx={{
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                        ...bookmanFont,
                      }}
                    >
                      {studentData.oldAuid}
                    </Typography>
                  </Box>
                ) : studentData.cancel_id ? (
                  <Typography
                    variant="subtitle2"
                    color="error"
                    sx={{ fontSize: 13 }}
                  >
                    {`Admission Cancelled on  ${moment(
                      studentData.approved_date
                    ).format("DD-MM-YYYY")}.`}
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default StudentDetails;
