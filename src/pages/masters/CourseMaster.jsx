import { useState, useEffect } from "react";
import { Tabs, Tab } from "@mui/material";
import CourseIndex from "../../containers/indeces/CourseMaster/CourseIndex";
import CourseTypeIndex from "../../containers/indeces/CourseMaster/CourseTypeIndex";
import CoursePatternIndex from "../../containers/indeces/CourseMaster/CoursePatternIndex";
import CourseCategoryIndex from "../../containers/indeces/CourseMaster/CourseCategoryIndex";
import CourseObjectiveIndex from "../../containers/indeces/CourseMaster/CourseObjectiveIndex";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useLocation, useNavigate } from "react-router-dom";

function CourseMaster() {
  const [tab, setTab] = useState("Course");
  const setCrumbs = useBreadcrumbs();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setCrumbs([{ name: "CourseMaster" }, { name: tab }]), [tab]);

  useEffect(() => {
    if (pathname.toLowerCase().includes("/course")) setTab("Course");
    if (pathname.toLowerCase().includes("/type")) setTab("Type");
    if (pathname.toLowerCase().includes("/pattern")) setTab("Pattern");
    if (pathname.toLowerCase().includes("/category")) setTab("Category");
    if (pathname.toLowerCase().includes("/courseobjectives"))
      setTab("CourseObjectives");
  }, [pathname]);

  const handleChange = (e, newValue) => {
    navigate("/CourseMaster/" + newValue);
  };

  return (
    <>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value="Course" label="Course" />
        <Tab value="Type" label="Course Type" />
        <Tab value="Category" label="Course Category" />
        <Tab value="Pattern" label="Course Pattern" />
        <Tab value="CourseObjectives" label="Course Objective" />
      </Tabs>
      {tab === "Course" && <CourseIndex />}
      {tab === "Type" && <CourseTypeIndex />}
      {tab === "Category" && <CourseCategoryIndex />}
      {tab === "Pattern" && <CoursePatternIndex />}
      {tab === "CourseObjectives" && <CourseObjectiveIndex />}
    </>
  );
}

export default CourseMaster;
