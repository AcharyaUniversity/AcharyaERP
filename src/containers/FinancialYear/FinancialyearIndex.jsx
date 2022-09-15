import { React, useState, useEffect } from "react";
import GridIndex from "../../components/GridIndex";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Button, Box } from "@mui/material";
import axios from "axios";
import ApiUrl from "../../services/Api";
import CustomModal from "../../components/CustomModal";
function FinancialyearIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/fetchAllFinancialYearDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = (params) => {
    const id = params.row.id;
    setModalOpen(true);
    const handleToggle = () => {
      if (params.row.active === true) {
        axios.delete(`${ApiUrl}/FinancialYear/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
      } else {
        axios.delete(`${ApiUrl}/activateFinancialYear/${id}`).then((res) => {
          if (res.status == 200) {
            getData();
            setModalOpen(false);
          }
        });
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

  const columns = [
    { field: "financial_year", headerName: "Financial Year", flex: 1 },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.from_date),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.to_date),
    },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "created_by",
      headerName: "Update",
      renderCell: (params) => {
        return (
          <Link to={`/AccountMaster/Financialyear/Update/${params.row.id}`}>
            <GridActionsCellItem icon={<EditIcon />} label="Update" />
          </Link>
        );
      },
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <GridActionsCellItem
            icon={<Check />}
            label="Result"
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ) : (
          <GridActionsCellItem
            icon={<HighlightOff />}
            label="Result"
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            {params.active}
          </GridActionsCellItem>
        ),
      ],
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 2 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <Button
          onClick={() => navigate("/AccountMaster/Financialyear/New")}
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
export default FinancialyearIndex;
