import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import StudentDetailsIndex from "../../containers/indeces/studentDetailMaster/StudentDetailsIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function StudentDetailsMaster() {
  const [tab, setTab] = useState("StudentsDetails");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setCrumbs([{ name: "Student Master" }]));

  useEffect(() => {
    if (pathname.toLowerCase().includes("/studentsdetails"))
      setTab("StudentsDetails");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/StudentDetailsMaster/" + newValue);
  };

  return (
    <>
      {/* <Tabs value={tab} onChange={handleChange}> */}
      <Tab value="StudentsDetails" label="" />
      {/* </Tabs> */}
      {tab === "StudentsDetails" && <StudentDetailsIndex />}
    </>
  );
}

export default StudentDetailsMaster;
