import { React, useState, useEffect } from "react";
import Grid from "../../components/Api/Grid";
import GridIndex from "../../components/GridIndex";
import IndexCreateButton from "../../components/Inputs/IndexCreateButton";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Check, HighlightOff } from "@mui/icons-material";
import ActivateInactive from "../../components/Api/ActivateInactive";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
function ModuleIndex() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState();
  const [activateId, setActivateId] = useState(false);

  const getData = async () => {
    let data = await Grid("fetchAllModuleDetails", "created_date");
    setRows(data);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = async (params) => {
    setOpen(true);
    setActiveId(params.row);
    let ids = params.row.active;
    if (ids === false) {
      setActivateId(true);
    }
    if (ids === true) {
      setActivateId(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleActivee = async () => {
    let id = activeId.id;
    let check = activeId.active;
    let endPoint = "";
    if (check === true) {
      endPoint = "Module";
    } else {
      endPoint = "activateModule";
    }

    let data = await ActivateInactive(endPoint, id);
    if (data === 200) {
      getData();
      setOpen(false);
    }
  };

  const columns = [
    { field: "module_name", headerName: "Module", flex: 1 },
    { field: "module_short_name", headerName: "Short Name", flex: 1 },
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
          <Link to={`/ModuleUpdate/${params.row.id}`}>
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
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText sx={{ color: "black" }}>
            {activateId
              ? "Do you want to make it Active ?"
              : "Do you want to make it Inactive ?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleActivee()}
            variant="contained"
            size="small"
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <IndexCreateButton label="Create" path="/RoleCreation" />
      <GridIndex rows={rows} columns={columns} />
    </>
  );
}
export default ModuleIndex;
