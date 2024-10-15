import { lazy, useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import moment from "moment";

const ModalWrapper = lazy(() => import("./ModalWrapper"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const headerCategories = [
  { label: "Fixed", value: "fixed" },
  { label: "P@B", value: "board" },
  { label: "SCH", value: "sch" },
  { label: "ACERP", value: "acerp" },
  { label: "Paid", value: "paid" },
  { label: "Due", value: "due" },
];

function StudentFeeDetails({ id }) {
  const [data, setData] = useState([]);
  const [noOfYears, setNoOfYears] = useState([]);
  const [total, setTotal] = useState();
  const [voucherData, setVoucherData] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [voucherPaidData, setVoucherPaidData] = useState([]);
  const [receiptHeaders, setReceiptHeaders] = useState([]);
  const [paidTotal, setPaidTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState({ label: "", value: "" });

  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/finance/dueAmountCalculationOnVocherHeadWiseAndYearWiseForFeeReceipt/${id}`
      );
      const {
        fee_template_sub_amount_info: subAmountDetails,
        fee_template_sub_amount_format: subAmount,
        Student_info: studentData,
        scholarship_approval_amount: sch,
        addOnData: acerp,
        fee_receipt_student_pay_his_format: paid,
        dueAmount: due,
        fee_receipt_student_pay_his: paidHistory,
      } = response.data;

      const {
        program_type: programType,
        number_of_years: noOfYears,
        number_of_semester: noOfSem,
      } = studentData[0];

      const feeTemp = { program_type_name: "Semester" };
      const totalYearsOrSemesters =
        programType === "Yearly" ? noOfYears * 2 : noOfSem;
      const yearSemesters = [];
      const expands = {};
      for (let i = 1; i <= totalYearsOrSemesters; i++) {
        if (
          feeTemp.program_type_name === "Semester" ||
          (feeTemp.program_type_name === "Yearly" && i % 2 !== 0)
        ) {
          yearSemesters.push({ key: i, value: `Sem ${i}` });
          expands[`year${i}`] = false;
        }
      }

      const totalAmount = {};
      const voucherAmount = {};
      const schAmount = sch[0];
      const receiptHeads = {};
      const paidTempTotal = {};
      const voucherReceiptAmt = {};
      yearSemesters.forEach((obj) => {
        const { key } = obj;
        const field = `year${key}`;
        const fixedTotal = Object.values(subAmount[key]).reduce(
          (a, b) => a + b
        );
        const paidTotal = Object.values(paid[key]).reduce((a, b) => a + b);

        const dueTotal = Object.values(due[key]).reduce((a, b) => a + b);
        totalAmount[field] = {
          fixed: fixedTotal,
          board: 0,
          sch: schAmount?.[`${field}_amount`] || 0,
          acerp: acerp[`sem${key}`],
          paid: paidTotal,
          due: dueTotal,
        };

        const receiptTemp = [];
        const filterReceipts = paidHistory.filter(
          (receipt) => receipt.paid_year === key
        );
        filterReceipts.forEach((filReceipt) => {
          const { fee_receipt, created_date } = filReceipt;
          receiptTemp.push({
            label: `${fee_receipt}/${moment(created_date).format(
              "DD-MM-YYYY"
            )}`,
            value: fee_receipt,
          });
        });
        receiptHeads[field] = receiptTemp;

        subAmountDetails.forEach((item, i) => {
          const { voucher_head_new_id: voucherId } = item;
          voucherAmount[field + voucherId] = {
            fixed: subAmount[key][voucherId],
            board: 0,
            sch: (i === 0 && schAmount?.[`${field}_amount`]) || 0,
            acerp: (i === 0 && acerp[`sem${key}`]) || 0,
            paid: paid[key][voucherId],
            due: due[key][voucherId],
          };

          receiptTemp.forEach((pay) => {
            const { value: receiptNo } = pay;
            const filterVoucherReceipt = filterReceipts.filter(
              (receipt) =>
                receipt.voucher_head_new_id === voucherId &&
                receipt.fee_receipt === receiptNo
            );
            const voucherReceiptAmount = filterVoucherReceipt.reduce(
              (sum, current) => sum + current.paid_amount,
              0
            );
            voucherReceiptAmt[field + voucherId + receiptNo] =
              voucherReceiptAmount || 0;
          });

          receiptTemp.forEach((pay) => {
            const { value: receiptNo } = pay;
            const filterYearReceipt = filterReceipts.filter(
              (receipt) =>
                receipt.paid_year === key && receipt.fee_receipt === receiptNo
            );
            const yearReceiptAmount = filterYearReceipt.reduce(
              (sum, current) => sum + current.paid_amount,
              0
            );
            paidTempTotal[field + receiptNo] = yearReceiptAmount || 0;
          });
        });
      });

      setNoOfYears(yearSemesters);
      setData(subAmountDetails);
      setIsExpanded(expands);
      setTotal(totalAmount);
      setVoucherData(voucherAmount);
      setVoucherPaidData(voucherReceiptAmt);
      setReceiptHeaders(receiptHeads);
      setPaidTotal(paidTempTotal);
    } catch (err) {
      console.error(err);

      setError("Failed to load ledger data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        Please wait ....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        No data available.
      </Typography>
    );
  }

  const handleExpand = (value) => {
    setIsExpanded((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleModal = (year) => {
    setSelectedYear({ label: `Sem - ${year}`, value: `year${year}` });
    setModalOpen(true);
  };

  const DisplayHeaderText = ({ label }) => (
    <Typography variant="subtitle2">{label}</Typography>
  );

  const DisplayBodyText = ({ label }) => (
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
  );

  const renderFeeDetails = (year) =>
    data?.map((obj, i) => (
      <TableRow key={i} sx={{ transition: "1s" }}>
        <StyledTableCellBody>
          <DisplayBodyText label={obj.voucher_head} />
        </StyledTableCellBody>
        {headerCategories.map((category, j) => (
          <StyledTableCellBody key={j} sx={{ textAlign: "right" }}>
            <DisplayBodyText
              label={
                voucherData[`${year}${obj.voucher_head_new_id}`][category.value]
              }
            />
          </StyledTableCellBody>
        ))}
      </TableRow>
    ));

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={1200}
        title={`${selectedYear.label} Paid History`}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Particulars</StyledTableCell>
                <StyledTableCell>Fixed</StyledTableCell>
                {receiptHeaders[selectedYear?.value]?.map((pay, k) => (
                  <StyledTableCell key={k} sx={{ textAlign: "right" }}>
                    <DisplayHeaderText label={pay.label} />
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.map((obj, i) => (
                <TableRow key={i} sx={{ transition: "1s" }}>
                  <StyledTableCellBody>
                    <DisplayBodyText label={obj.voucher_head} />
                  </StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: "right" }}>
                    <DisplayBodyText
                      label={
                        voucherData[
                          `${selectedYear.value}${obj.voucher_head_new_id}`
                        ]?.["fixed"]
                      }
                    />
                  </StyledTableCellBody>

                  {receiptHeaders[`${selectedYear.value}`]?.map((pay, k) => {
                    return (
                      <StyledTableCellBody key={k} sx={{ textAlign: "right" }}>
                        <DisplayBodyText
                          label={
                            voucherPaidData[
                              `${selectedYear.value}${obj.voucher_head_new_id}${pay.value}`
                            ]
                          }
                        />
                      </StyledTableCellBody>
                    );
                  })}
                </TableRow>
              ))}
              <TableRow>
                <StyledTableCellBody>
                  <DisplayHeaderText label="Total" />
                </StyledTableCellBody>
                <StyledTableCellBody sx={{ textAlign: "right" }}>
                  <DisplayHeaderText
                    label={total[selectedYear?.value]?.["fixed"]}
                  />
                </StyledTableCellBody>
                {receiptHeaders?.[selectedYear?.value]?.map((pay, l) => (
                  <StyledTableCellBody key={l} sx={{ textAlign: "right" }}>
                    <DisplayHeaderText
                      label={paidTotal[selectedYear?.value + pay.value]}
                    />
                  </StyledTableCellBody>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ModalWrapper>

      <Box>
        {noOfYears.map((obj, i) => {
          const { key, value } = obj;
          const field = `year${obj.key}`;
          return (
            <TableContainer key={i} component={Paper} sx={{ marginBottom: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: "25%" }}>
                      <DisplayHeaderText label={value} />
                    </StyledTableCell>
                    {headerCategories.map((category, j) => (
                      <StyledTableCell
                        key={j}
                        sx={{
                          textAlign: "right",
                          width: "12%",
                        }}
                      >
                        {j === 5 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: 6,
                              justifyContent: "right",
                            }}
                          >
                            <Typography variant="subtitle2">
                              {category.label}
                            </Typography>
                            <IconButton
                              onClick={() => handleExpand(field)}
                              sx={{
                                padding: 0,
                                transition: "1s",
                              }}
                            >
                              {isExpanded[field] ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              )}
                            </IconButton>
                          </Box>
                        ) : (
                          <DisplayHeaderText label={category.label} />
                        )}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isExpanded[field] && renderFeeDetails(field)}
                  <TableRow>
                    <StyledTableCellBody>
                      <DisplayHeaderText label="Total" />
                    </StyledTableCellBody>
                    {headerCategories.map((categories, k) => (
                      <StyledTableCellBody
                        key={k}
                        sx={{
                          textAlign: "right",
                        }}
                      >
                        {k === 4 ? (
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            onClick={() => handleModal(key)}
                          >
                            {total[field][categories?.value]}
                          </Typography>
                        ) : (
                          <DisplayHeaderText
                            label={total[field][categories?.value]}
                          />
                        )}
                      </StyledTableCellBody>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          );
        })}
      </Box>
    </>
  );
}

export default StudentFeeDetails;
