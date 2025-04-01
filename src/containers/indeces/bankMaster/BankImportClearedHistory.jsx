import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  tableCellClasses,
  styled,
  TableRow,
  Grid,
  Table,
  Paper,
  Tooltip,
  tooltipClasses,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Visibility } from "@mui/icons-material";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import moment from "moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { TRANSACTION_TYPE } from "../../../services/Constants";
import { Check, HighlightOff } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#5A5A5A",
    maxWidth: 270,
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
  },
}));

function BankImportClearedHistory() {
    const [rows, setRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [transactionOpen, setTransactionOpen] = useState(false);
    const [usdOpen, setUsdOpen] = useState(false);
    const [values, setValues] = useState({ totalUsd: "", exchangeRate: "" });
    const [rowData, setRowData] = useState([]);
    const [modalContent, setModalContent] = useState({
         title: "",
         message: "",
         buttons: [],
       });
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
   // getClearedHistory();
     getData();
    setCrumbs([{ name: "BankMaster", link: "/BankMaster/Import" }]);
  }, []);

  // const columns = [
  //   {
  //     field: "created_Date",
  //     headerName: "Imported Date",
  //     flex: 1,
  //     valueGetter: (value, row) =>
  //       row.created_Date
  //         ? moment(row.created_Date).format("DD-MM-YYYY")
  //         : "NA",
  //   },
  //   {
  //     field: "transaction_date",
  //     headerName: "Transaction Date",
  //     flex: 1,
  //   },
  //   { field: "transaction_no", headerName: "Transaction No", flex: 1 },
  //   { field: "bank_name", headerName: "Bank", flex: 1 },
  //   {
  //     field: "cheque_dd_no",
  //     headerName: "Cheque/DD No",
  //     flex: 1,
  //     renderCell: (params) => {
  //       return params.row.cheque_dd_no.length > 15 ? (
  //         <HtmlTooltip title={params.row.cheque_dd_no}>
  //           <Typography
  //             variant="subtitle2"
  //             color="textSecondary"
  //             sx={{ fontSize: 13, cursor: "pointer" }}
  //           >
  //             {params.row.cheque_dd_no.substr(0, 13) + "..."}
  //           </Typography>
  //         </HtmlTooltip>
  //       ) : (
  //         <HtmlTooltip title={params.row.cheque_dd_no}>
  //           <Typography
  //             variant="subtitle2"
  //             color="textSecondary"
  //             sx={{ fontSize: 13, cursor: "pointer" }}
  //           >
  //             {params.row.cheque_dd_no}
  //           </Typography>
  //         </HtmlTooltip>
  //       );
  //     },
  //   },
  //   { field: "amount", headerName: "Amount", flex: 1 },
  //   { field: "balance", headerName: "Balance", flex: 1 },
  //   {
  //     field: "receipt_no",
  //     headerName: "Receipt No",
  //     flex: 1,
  //     type: "actions",
  //     getActions: (params) => [
  //       <IconButton color="primary" onClick={() => handleModalOpen(params)}>
  //         <Visibility fontSize="small" />
  //       </IconButton>,
  //     ],
  //   },
  //   { field: "created_username", headerName: "Created By", flex: 1 },
  // ];

   const columns = [
      {
        field: "created_Date",
        headerName: "Imported Date",
        flex: 1,
        valueGetter: (value, row) =>
         row.import_date ? moment(row.import_date).format("DD-MM-YYYY") : "NA",
      },
      {
        field: "transaction_date",
        headerName: "Transaction Date",
        flex: 1,
      },
      {
        field: "pay_id",
        headerName: "Pay Id",
        flex: 1,
      },
      {
        field: "bank_details",
        headerName: "Reference No",
        flex: 1,
      },
      {
        field: "transaction_type",
        headerName: "Type",
        flex: 1,
        valueGetter: (value, row) => row?.transaction_type ? TRANSACTION_TYPE[row?.transaction_type] : "",
      },
      {
        field: "AUID",
        headerName: "auid",
        flex: 1,
        hide: true,
      },
      {
        field: "email/phone",
        headerName: "Email/Phone",
        flex: 1,
        hide: true,
        renderCell: (params) => {
          const emailAndPhoneNo = getEmailAndPhoneNo(params)
          return <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{ fontSize: 13, cursor: "pointer" }}
              >
               {emailAndPhoneNo}
              </Typography>
        }
      },
      {
        field: "transaction_no",
        headerName: "Transaction No",
        flex: 1,
        hide: true,
      },
      {
        field: "inst",
        headerName: "School",
        flex: 1,
      },
      { field: "voucher_head", headerName: "Bank", flex: 1 },
      { field: "amount", headerName: "Amount", flex: 1, headerAlign: "center", cellClassName: "rightAlignedCell"},
      { field: "balance", headerName: "Balance", flex: 1, headerAlign: "center", cellClassName: "rightAlignedCell" },
      {
        field: "view",
        headerName: "View",
        flex: 1,
        type: "actions",
        getActions: (params) => [
          <IconButton onClick={() => handleModalOpen(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>,
        ],
      },
      { field: "created_username", headerName: "Created By", flex: 1 },
      // {
      //   field: "receipt_status",
      //   headerName: "Receipt Status",
      //   flex: 1,
      //   hide: true,
      //   renderCell: (params) => ( 
      //     <Typography
      //           variant="subtitle2"
      //           color="textSecondary"
      //           sx={{ fontSize: 13 }}
      //         >
      //          Success
      //         </Typography>
      //   )
      // },
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
    const getData = async () => {
      await axios
        .get(
          `/api/student/fetchAllbankImportTransactionDetail?page=${0}&page_size=${10000}&sort=created_by`
        )
        .then((res) => {
          const rowData = res.data.data.Paginated_data.content && res.data.data.Paginated_data.content?.filter((item)=> item?.balance === 0)
          setRows(rowData || []);
        })
        .catch((err) => console.error(err));
    };
  // const getClearedHistory = async () => {
  //   await axios
  //     .get(
  //       `/api/student/fetchAllbankImportTransactionDetailsForClearedHistory?page=${0}&page_size=${10000}&sort=created_by`
  //     )
  //     .then((res) => {
  //       setRows(res.data.data.Paginated_data.content);
  //     })
  //     .catch((err) => console.error(err));
  // };

  const handleModalOpen = async (params) => {
    setModalOpen(true);
    await axios
      .get(`/api/finance/allRTGSFeeHistoryDetails/${params.row.id}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getEmailAndPhoneNo = (params) =>{
    if (params?.row?.email && params?.row?.phone_no) {
      return `${params.row.email}/${params.row.phone_no}`;
    } else if (params?.row?.email) {
      return params.row.email;
    } else if (params?.row?.phone_no) {
      return params.row.phone_no;
    } else {
      return "";
    }
  }

     const handleActive = async (params) => {
        const id = params.row.id;
        setModalOpen(true);
        const handleToggle = async () => {
          if (params.row.active === true) {
            await axios
              .delete(`/api/student/bankImportTransaction/${id}`)
              .then((res) => {
                if (res.status === 200) {
                  getData();
                }
              })
              .catch((err) => console.error(err));
          } else {
            await axios
              .delete(`/api/student/activateBankImportTransaction/${id}`)
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
              title: "",
              message: "Are you sure you want to cancel ?",
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
        setModalOpen(true);
      };
      

  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <ModalWrapper
          title="Transaction Fee Receipt"
          maxWidth={1000}
          open={modalOpen}
          setOpen={setModalOpen}
        >
          <Grid container>
            <Grid item xs={12} mt={2}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>AUID</StyledTableCell>
                      <StyledTableCell>USN</StyledTableCell>
                      <StyledTableCell>Receipt No</StyledTableCell>
                      <StyledTableCell>Receipt Date</StyledTableCell>
                      <StyledTableCell>Transaction Date</StyledTableCell>
                      <StyledTableCell>Paid</StyledTableCell>
                      <StyledTableCell>Created Date</StyledTableCell>
                      <StyledTableCell>Created By</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {data.length > 0 ? (
                      data.map((obj, i) => {
                        return (
                          <StyledTableRow key={i}>
                            <StyledTableCell>
                              {obj.student_name}
                            </StyledTableCell>
                            <StyledTableCell>{obj.auid}</StyledTableCell>
                            <StyledTableCell>{obj.usn}</StyledTableCell>
                            <StyledTableCell>{obj.receipt_no}</StyledTableCell>
                            <StyledTableCell>
                              {obj.created_date
                                .substr(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.transaction_date}
                            </StyledTableCell>
                            <StyledTableCell>{obj.paid}</StyledTableCell>
                            <StyledTableCell>
                              {obj.created_date
                                .substr(0, 10)
                                .split("-")
                                .reverse()
                                .join("-")}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.created_username}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </ModalWrapper>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default BankImportClearedHistory;
