import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import AcademicYearIndex from "../../containers/indeces/AcademicYearIndex";
import FinancialyearIndex from "../../containers/indeces/FinancialyearIndex";
import CalenderyearIndex from "../../containers/indeces/CalenderyearIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

function AcademicCalendars() {
  const [value, setValue] = useState(0);

  const setCrumbs = useBreadcrumbs();

  useEffect(() => setCrumbs([{ name: "AcademicCalendars" }]), []);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Academic Year" />
        <Tab label="Financial year" />
        <Tab label="Calender year" />
      </Tabs>

      {value === 0 && <AcademicYearIndex />}
      {value === 1 && <FinancialyearIndex />}
      {value === 2 && <CalenderyearIndex />}
    </>
  );
}

export default AcademicCalendars;
