import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { useNavigate } from "react-router-dom";
import { HighlightOff, Visibility } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../../services/Api";
import moment from "moment";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import CustomModal from "../../../components/CustomModal";
import DraftPoView from "../../../pages/forms/inventoryMaster/DraftPoView";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import AddIcon from "@mui/icons-material/Add";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const initialValues = {
  approverId: "",
  quotationPdf: "",
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function AssignPoApprover() {
  const [rows, setRows] = useState([]);
  const [approverOpen, setApproverOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [userOptions, setUserOptions] = useState([]);
  const [userName, setUserName] = useState("");
  const [rowData, setRowData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [modalUploadOpen, setModalUploadOpen] = useState(false);
  const [id, setId] = useState(null);
  const [tempPurchaseOrderId, setTempPurchaseOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    quotationPdf: [
      values.quotationPdf && values.quotationPdf.name.endsWith(".pdf"),
      values.quotationPdf && values.quotationPdf.size < 2000000,
    ],
  };

  const errorMessages = {
    quotationPdf: ["Please upload pdf", "Maximum size 2 MB"],
  };

  const columns = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      valueGetter: (value, row) =>
        moment(row.createdDate).format("DD-MM-YYYY"),
    },
    {
      field: "createdUsername",
      headerName: "Created By",
      flex: 1,
    },
    { field: "vendor", headerName: "Vendor", flex: 1 },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      headerAlign: "right",
      align: "right",
      flex: 1,
      valueGetter: (value, row) =>
        row.totalAmount ? Math.round(row.totalAmount) : "",
    },
    {
      field: "Print",
      headerName: "Draft PO",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handlePreview(params)}>
            <Visibility fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "print_draft",
      headerName: "Print",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() =>
              navigate(`/DraftPoPdf/${params.row.temporaryPurchaseOrderId}`, {
                state: { letterHeadStatus: true },
              })
            }
          >
            <PrintIcon fontSize="small" color="primary" />
          </IconButton>
        );
      },
    },
    {
      field: "Cancel_po",
      headerName: "Cancel",
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => handleCancelPo(params)}>
            <HighlightOff fontSize="small" color="error" />
          </IconButton>
        );
      },
    },

    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(
              `/DirectPoCreation/Update/${params.row.temporaryPurchaseOrderId}`
            )
          }
        >
          <EditIcon />
        </IconButton>,
      ],
    },
    {
      field: "upload",
      headerName: "Comparitive Quote",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        params.row.tpoAttachmentFilePath === null ? (
          <IconButton onClick={() => handleUpload(params)} color="primary">
            <CloudUploadOutlinedIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleDownload(params)} color="primary">
            <Visibility fontSize="small" />
          </IconButton>
        ),
      ],
    },
    {
      field: "purchase_approver",
      headerName: "Assign Approver",
      flex: 1,
      renderCell: (params) => [
        params.row.purchaseApprover !== null ? (
          <Typography
            variant="subtitle2"
            onClick={() => handleAssignApprover(params)}
            sx={{ cursor: "pointer" }}
          >
            {params.row.purchaseApprover}
          </Typography>
        ) : (
          <IconButton onClick={() => handleAssignApprover(params)}>
            <AddTaskIcon fontSize="small" color="primary" />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();
    getUsers();
    setCrumbs([]);
  }, []);


  const handleAssignApprover = (params) => {
    setApproverOpen(true);
    setRowData(params.row);
  };

  const handleUpload = (params) => {
    setModalUploadOpen(true);
    setTempPurchaseOrderId(params.row.temporaryPurchaseOrderId);
  };

  const handleDownload = async (params) => {
    await axios
      .get(
        `/api/purchase/temporaryPurchaseOrderFileDownload?fileName=${params.row.tpoAttachmentFilePath}`,
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        window.open(url);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "approverId") {
      await axios
        .get(`/api/purchase/getApprovers`)
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.userId === newValue) {
              setUserName(obj.userName);
            }
          });
        })
        .catch((err) => console.error(err));
    }

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const getUsers = async () => {
    await axios
      .get(`/api/purchase/getApprovers`)
      .then((res) => {
        const purchaseApprovers = res.data.data.filter(
          (obj) => obj.purchase_approver
        );
        setUserOptions(
          purchaseApprovers.map((obj) => ({
            value: obj.userId,
            label: obj.userName,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    const requestData = {
      pageNo: 0,
      pageSize: 100000,
      createdDate: null,
      institute: null,
      vendor: null,
    };

    await axios
      .post(`/api/purchase/getDraftPurchaseOrder`, requestData)
      .then((res) => {
        const rowId = res.data.data.content.map((obj, index) => ({
          ...obj,
          id: index + 1,
        }));
        setRows(rowId?.reverse());
      })
      .catch((err) => console.error(err));
  };

  const handleCancelPo = (params) => {
    setModalOpen(true);
    const handleToggle = async () => {
      await axios
        .delete(
          `/api/purchase/cancelDraft?temporaryPurchaseOrderId=${params.row.temporaryPurchaseOrderId}&cancelById=${userId}`
        )
        .then((res) => {
          if (res.status === 200 || res.status === 210) {
            setAlertMessage({
              severity: "success",
              message: "Cancelled Successfully",
            });
            setAlertOpen(true);
            setModalOpen(false);
            getData();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => console.error(err));
    };
    setModalContent({
      title: "",
      message: "Are you sure you want to cancel this po ?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => { } },
      ],
    });
  };

  const handleAssign = async () => {
    await axios
      .post(
        `/api/purchase/assignPurchaseApprover?purchaseApprover=${userName}&id=${values.approverId}&temporaryPurchaseOrderId=${rowData.temporaryPurchaseOrderId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 210) {
          setAlertMessage({
            severity: "success",
            message: "Assigned Successfully",
          });
          setAlertOpen(true);
          setApproverOpen(false);
          getData();
        } else {
          setAlertMessage({
            severity: "error",
            message: "Error Occured",
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const handlePreview = (params) => {
    setModalPreview(true);
    setId(params.row.temporaryPurchaseOrderId);
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const uploadPdf = async () => {
    setLoading(true);
    const dataArray = new FormData();
    dataArray.append("file", values.quotationPdf);
    dataArray.append("temporary_purchase_order_id", tempPurchaseOrderId);
    await axios
      .post(`/api/purchase/temporaryPurchaseOrderUploadFile`, dataArray)
      .then((res) => {
        setLoading(false);
        setAlertMessage({
          severity: "success",
          message: "File Uploaded",
        });
        setAlertOpen(true);
        setModalUploadOpen(false);
        setValues({});
        getData();
      })
      .catch((err) => {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };
  return (
    <>
      <ModalWrapper
        open={modalUploadOpen}
        setOpen={setModalUploadOpen}
        maxWidth={500}
        title="Upload File"
      >
        <Grid item xs={12} md={10}>
          <CustomFileInput
            name="quotationPdf"
            label="PDF"
            file={values.quotationPdf}
            handleFileDrop={handleFileDrop}
            handleFileRemove={handleFileRemove}
            checks={checks.quotationPdf}
            errors={errorMessages.quotationPdf}
          />
        </Grid>
        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            size="small"
            style={{ borderRadius: 4 }}
            disabled={
              loading ||
              !values?.quotationPdf?.name?.endsWith(".pdf") ||
              values?.quotationPdf?.size > 2000000
            }
            onClick={uploadPdf}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <strong> Upload</strong>
            )}
          </Button>
        </Grid>
      </ModalWrapper>
      <ModalWrapper
        maxWidth={900}
        open={modalPreview}
        setOpen={setModalPreview}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          marginTop={2}
        >
          <Grid item xs={12}>
            <DraftPoView temporaryPurchaseOrderId={id} />
          </Grid>
        </Grid>
      </ModalWrapper>
      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          disabled={rows.active === false}
          onClick={() => navigate("/DirectpoCreation")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>

        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <GridIndex rows={rows} columns={columns} />
        <ModalWrapper
          open={approverOpen}
          setOpen={setApproverOpen}
          maxWidth={600}
          title="Assign Approver"
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={2}
            alignItems="center"
            justifycontents="flex-start"
            mt={2}
          >
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="approverId"
                handleChangeAdvance={handleChangeAdvance}
                label="Select Approver"
                value={values.approverId}
                options={userOptions}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleAssign}
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}

export default AssignPoApprover;
