import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";

import useBreadcrumbs from "../hooks/useBreadcrumbs";
import TranscriptIndex from "../containers/TranscriptIndex";
import TranscriptDetails from "../containers/TranscriptDetails";

function TranscriptMaster() {
  const [value, setValue] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "TranscriptMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={0} label="Transcript" />
        <Tab value={1} label="Transcript Assignmet" />
      </Tabs>

      {value === 0 && <TranscriptIndex />}
      {value === 1 && <TranscriptDetails />}
    </>
  );
}

export default TranscriptMaster;
