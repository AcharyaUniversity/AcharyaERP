import { React, useState, useEffect } from "react";
import axios from "axios";
import ApiUrl from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import { Link } from "react-router-dom";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { Check, HighlightOff } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWrapper from "../../components/ModalWrapper";
import CustomTextField from "../../components/Inputs/CustomTextField";
import { Box, Grid, Button, CircularProgress } from "@mui/material";

function UserIndex() {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });

  const getData = async () => {
    axios
      .get(
        `${ApiUrl}/fetchAllUserAuthenticationDetails?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((Response) => {
        setRows(Response.data.data.Paginated_data.content);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleActive = (params) => {
    setModalOpen(true);
    const id = params.row.id;
    const active = () => {
      console.log(id);
      console.log(params.row.active);
      params.row.active === true
        ? axios
            .delete(`${ApiUrl}/UserAuthentication/${id}`)
            .then((Response) => {
              console.log(Response);
              if (Response.status === 200) {
                getData();
                setModalOpen(false);
              }
            })
        : axios
            .delete(`${ApiUrl}/activateUserAuthentication/${id}`)
            .then((Response) => {
              console.log(Response);
              if (Response.status === 200) {
                getData();
                setModalOpen(false);
              }
            });
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: active },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
  };
  const columns = [
    { field: "username", headerName: "User Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "usertype", headerName: "User Type", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
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
            onClick={() => {
              handleActive(params);
            }}
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
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <GridIndex rows={rows} columns={columns} />
    </>
  );
}
export default UserIndex;
