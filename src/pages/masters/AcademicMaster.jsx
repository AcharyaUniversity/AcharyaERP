import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import SectionIndex from "../../containers/indeces/AcademicMaster/SectionIndex";
import BatchIndex from "../../containers/indeces/AcademicMaster/BatchIndex";

function AcademicMaster() {
  const [tab, setTab] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "Academic Master" }]), []);

  const handleChange = (e, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0} label="Section" />
        <Tab value={1} label="Batch" />
      </Tabs>

      {tab === 0 && <SectionIndex />}
      {tab === 1 && <BatchIndex />}
    </>
  );
}

export default AcademicMaster;
