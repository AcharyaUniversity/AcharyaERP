import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import ModuleIndex from "../../containers/indeces/ModuleIndex";
import MenuIndex from "../../containers/indeces/MenuIndex";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function NavigationMaster() {
  const [value, setValue] = useState(1);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "NavigationMaster" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab value={0} label="Module" />
        <Tab value={1} label="Menu" />
      </Tabs>

      {value === 0 && <ModuleIndex />}
      {value === 1 && <MenuIndex />}
    </>
  );
}

export default NavigationMaster;
