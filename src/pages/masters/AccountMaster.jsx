import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import GroupIndex from "../../containers/indeces/GroupIndex";
import LedgerIndex from "../../containers/indeces/LedgerIndex";
import TallyheadIndex from "../../containers/indeces/TallyheadIndex";
import VoucherIndex from "../../containers/indeces/VoucherIndex";
import VoucherAssignmentIndex from "../../containers/indeces/VoucherAssignmentIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
function AccountMaster() {
  const [value, setValue] = useState(0);
  const setCrumbs = useBreadcrumbs();
  useEffect(() => setCrumbs([{ name: "AccountMaster" }]), []);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Group" />
        <Tab label="Ledger" />
        <Tab label="Tallyhead" />
        <Tab label="Voucher Head" />
        <Tab label="Assignment" />
      </Tabs>

      {value === 0 && <GroupIndex />}
      {value === 1 && <LedgerIndex />}
      {value === 2 && <TallyheadIndex />}
      {value === 3 && <VoucherIndex />}
      {value === 4 && <VoucherAssignmentIndex />}
    </>
  );
}

export default AccountMaster;
