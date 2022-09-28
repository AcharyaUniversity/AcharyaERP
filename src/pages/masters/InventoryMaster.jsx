import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import VendorIndex from "../../containers/indeces/VendorIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
function InventoryMaster() {
  const [value, setValue] = useState(0);
  const setCrumbs = useBreadcrumbs();
  useEffect(() => setCrumbs([{ name: "InventoryMaster" }]), []);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Vendor" />
      </Tabs>
      {value === 0 && <VendorIndex />}
    </>
  );
}

export default InventoryMaster;
