import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import DesignationIndex from "../../containers/indeces/DesignationIndex";

function DesignationMaster() {
  const [value, setValue] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "DesignationMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={0} label="" />
      </Tabs>

      {value === 0 && <DesignationIndex />}
    </>
  );
}

export default DesignationMaster;
