import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import ApplicationIndex from "../../containers/indeces/ApplicationIndex";

function CandidateWalkinMaster() {
  const [value, setValue] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "CandidateWalkinMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={0} label="Candidate Wakin Details" />
      </Tabs>

      {value === 0 && <ApplicationIndex />}
    </>
  );
}

export default CandidateWalkinMaster;
