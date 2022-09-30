import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import StoreIndex from "../../containers/indeces/StoreIndex";
import MeasureIndex from "../../containers/indeces/MeasureIndex";

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
        <Tab value={0} label="Store" />
        <Tab value={1} label="Measurement" />
      </Tabs>

      {value === 0 && <StoreIndex />}
      {value === 1 && <MeasureIndex />}
    </>
  );
}

export default InventoryMaster;
