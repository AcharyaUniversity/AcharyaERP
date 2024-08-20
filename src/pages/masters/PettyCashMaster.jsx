import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import PettyCashIndex from "../../containers/indeces/pettyCashMaster/PettyCashIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

const tabsData = [
  {
    label: "Petty Cash",
    value: "Petty Cash",
    component: PettyCashIndex,
  },
];

function PettyCashMaster() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  // Determine the initial tab based on the current URL
  const initialTab =
    tabsData.find((tab) => pathname.includes(tab.value))?.value ||
    "Petty Cash";
  const [tab, setTab] = useState(initialTab);

  // Update the tab state when the URL changes
  useEffect(() => {
    setTab(
      tabsData.find((tab) => pathname.includes(tab.value))?.value ||
        "Petty Cash"
    );
  }, [pathname]);

  useEffect(
    () => setCrumbs([{ name: "Petty Cash Master" }, { name: tab }]),
    [tab]
  );

  const handleChange = (event, newValue) => {
    console.log(newValue,"newValue");
    setTab(newValue);
    navigate(`/PettyCash/${newValue}`);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        {tabsData.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={tabItem.label}
          />
        ))}
      </Tabs>
      {tabsData.map((tabItem) => (
        <div key={tabItem.value}>
          {tab === tabItem.value && <tabItem.component />}
        </div>
      ))}
    </>
  );
}

export default PettyCashMaster;
