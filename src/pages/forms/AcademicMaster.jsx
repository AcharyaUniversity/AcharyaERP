import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ProgramIndex from "../containers/Program/ProgramIndex";
import ProgramSpecializationIndex from "../containers/ProgramSpecialization/ProgramSpecializationIndex";
import ProgramAssIndex from "../containers/ProgramAssignment/ProgramAssIndex";
import DepartmentIndex from "../containers/Department/DepartmentIndex";
import DepartmentAssignmentIndex from "../containers/DepartmentAssignment/DepartmentAssignmentIndex";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
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
        <Tab label="Dept Assignment" />
        <Tab label="Program" />
        <Tab label="Prog Assignment" />
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
