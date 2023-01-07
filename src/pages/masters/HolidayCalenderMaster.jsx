import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import HolidayCalenderIndex from "../../containers/indeces/HolidayCalenderMaster/HolidayCalenderIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";

function HolidayCalenderMaster() {
  const [tab, setTab] = useState("HolidayCalenders");
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(
    () => setCrumbs([{ name: "HolidayCalender Master" }, { name: tab }]),
    [tab]
  );

  useEffect(() => {
    if (pathname.toLowerCase().includes("/holidaycalenders"))
      setTab("HolidayCalenders");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/HolidayCalenderMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="HolidayCalenders" label="HolidayCalenders" />
      </Tabs>
      {tab === "HolidayCalenders" && <HolidayCalenderIndex />}
    </>
  );
}

export default HolidayCalenderMaster;
