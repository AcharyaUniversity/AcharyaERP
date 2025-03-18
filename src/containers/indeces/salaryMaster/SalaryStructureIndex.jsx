import { useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Box, IconButton, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router-dom";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import SalaryStructureView from "../../../components/SalaryStructureView";
import moment from "moment";

function SalaryStructureIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [salaryWrapperOpen, setSalaryWrapperOpen] = useState(false);
  const [salaryStructureId, setSalaryStructureId] = useState();
  const [salaryStructure, setSalaryStructure] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/finance/fetchAllSalaryStructureDetail?page=${0}&page_size=${10000}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios
          .delete(`/api/finance/SalaryStructure/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
              setModalOpen(false);
            }
          })
          .catch((err) => console.error(err));
      } else {
        axios
          .delete(`/api/finance/activateSalaryStructure/${id}`)
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

  const handleSalaryStructure = (params) => {
    setSalaryStructureId(params.id);
    setSalaryStructure(params.salary_structure);
    setSalaryWrapperOpen(true);
  };

  const columns = [
    {
      field: "salary_structure",
      headerName: "Salary Structure",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => handleSalaryStructure(params.row)}
            >
              {params.row.salary_structure}
            </Typography>
          </>
        );
      },
    },
    {
      field: "print_name",
      headerName: "Print Name",
      flex: 1,
    },
    { field: "remarks", headerName: "Remarks", flex: 1 },

    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (value, row) =>
        row.created_date
          ? moment(row.created_date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/SalaryMaster/SalaryStructure/Update/${params.row.id}`)
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
    <Box sx={{ position: "relative", mt: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        open={salaryWrapperOpen}
        setOpen={setSalaryWrapperOpen}
        title={salaryStructure}
        maxWidth={1000}
      >
        <SalaryStructureView id={salaryStructureId} />
      </ModalWrapper>
      <Button
        onClick={() => navigate("/SalaryMaster/SalaryStructure/New")}
        variant="contained"
        disableElevation
        sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
        startIcon={<AddIcon />}
      >
        Create
      </Button>
      <GridIndex rows={rows} columns={columns} />
    </Box>
  );
}

export default SalaryStructureIndex;
