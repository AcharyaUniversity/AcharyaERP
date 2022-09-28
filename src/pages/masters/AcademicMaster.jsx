import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import DepartmentIndex from "../../containers/indeces/DepartmentIndex";
import DepartmentAssignmentIndex from "../../containers/indeces/DepartmentAssignmentIndex";
import ProgramIndex from "../../containers/indeces/ProgramIndex";
import ProgramAssIndex from "../../containers/indeces/ProgramAssIndex";
import ProgramSpecializationIndex from "../../containers/indeces/ProgramSpecializationIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
function AcademicMaster() {
  const [value, setValue] = useState(0);
  const setCrumbs = useBreadcrumbs();
  useEffect(() => setCrumbs([{ name: "AcademicMaster" }]), []);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Department" />
        <Tab label="Dept Assign" />
        <Tab label="Program" />
        <Tab label="Prog Assign" />
        <Tab label="Specialization" />
      </Tabs>
      {value === 0 && <DepartmentIndex />}
      {value === 1 && <DepartmentAssignmentIndex />}
      {value === 2 && <ProgramIndex />}
      {value === 3 && <ProgramAssIndex />}
      {value === 4 && <ProgramSpecializationIndex />}
    </>
  );
}

export default AcademicMaster;
