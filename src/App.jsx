import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import ThemeContextProvider from "./contexts/ThemeContextProvider";
import AlertContextProvider from "./contexts/AlertContextProvider";
import NavigationLayout from "./layouts/NavigationLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FormExample from "./containers/examples/FormExample";

// Master pages
import InstituteMaster from "./pages/masters/InstituteMaster";
import NavigationMaster from "./pages/masters/NavigationMaster";

import AcademicMaster from "./pages/masters/AcademicMaster";

// Institute master forms
import SchoolForm from "./pages/forms/instituteMaster/SchoolForm";
import OrganizationForm from "./pages/forms/instituteMaster/OrganizationForm";
import JobtypeForm from "./pages/forms/instituteMaster/JobtypeForm";
import EmptypeForm from "./pages/forms/instituteMaster/EmptypeForm";

// Navigation master forms
import ModuleForm from "./pages/forms/navigationMaster/ModuleForm";
import MenuForm from "./pages/forms/navigationMaster/MenuForm";
import SubmenuForm from "./pages/forms/navigationMaster/SubmenuForm";
import RoleForm from "./pages/forms/navigationMaster/RoleForm";

//Academic Master
import DepartmentForm from "./pages/forms/academicMaster/DepartmentForm";
import DepartmentAssignmentForm from "./pages/forms/academicMaster/DepartmentAssignmentForm";
import ProgramForm from "./pages/forms/academicMaster/ProgramForm";
import ProgramAssignmentForm from "./pages/forms/academicMaster/ProgramAssignmentForm";
import ProgramSpecializationForm from "./pages/forms/academicMaster/ProgramSpecializationForm";

function App() {
  return (
    <ThemeContextProvider>
      <AlertContextProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login" />} />
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
            <Route exact path="/ResetPassword" element={<ResetPassword />} />

            <Route element={<NavigationLayout />}>
              <Route exact path="/FormExample" element={<FormExample />} />
              <Route exact path="/Dashboard" element={<></>} />
              {/* add your routes here */}

              {/* Institute Master */}

              <>
                <Route
                  exact
                  path="/InstituteMaster"
                  element={<InstituteMaster />}
                />

                <Route
                  exact
                  path="/InstituteMaster/Emptype/New"
                  element={<EmptypeForm />}
                />

                <Route exact path="/InstituteMaster/Emptype/Update/:id" />
                <Route
                  exact
                  path="/InstituteMaster/Emptype/New"
                  element={<EmptypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Emptype/Update/:id"
                  element={<EmptypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Jobtype/New"
                  element={<JobtypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Jobtype/Update/:id"
                  element={<JobtypeForm />}
                />

                <Route
                  exact
                  path="/InstituteMaster/Organization/New"
                  element={<OrganizationForm />}
                />

                <Route
                  exact
                  path="/InstituteMaster/Organization/Update/:id"
                  element={<OrganizationForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Jobtype/New"
                  element={<JobtypeForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/Jobtype/Update/:id"
                  element={<JobtypeForm />}
                />
              </>

              {/* Navigation Master */}
              <>
                <Route
                  exact
                  path="/NavigationMaster"
                  element={<NavigationMaster />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Module/New"
                  element={<ModuleForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Module/Update/:id"
                  element={<ModuleForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Menu/New"
                  element={<MenuForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Menu/Update/:id"
                  element={<MenuForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Submenu/New"
                  element={<SubmenuForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Submenu/Update/:id"
                  element={<SubmenuForm />}
                />

                {/*Academic Master */}
                <Route
                  exact
                  path="/AcademicMaster"
                  element={<AcademicMaster />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Department/New"
                  element={<DepartmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Department/Update/:id"
                  element={<DepartmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/DepartmentAssignment/New"
                  element={<DepartmentAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/DepartmentAssignment/Update/:id"
                  element={<DepartmentAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Program/New"
                  element={<ProgramForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Program/Update/:id"
                  element={<ProgramForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramAssignment/New"
                  element={<ProgramAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramAssignment/Update/:id"
                  element={<ProgramAssignmentForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramSpecialization/New"
                  element={<ProgramSpecializationForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/ProgramSpecialization/Update/:id"
                  element={<ProgramSpecializationForm />}
                />

                {/*Inventory Master */}
                <Route exact path="/head" element={<>Head</>} />
                <Route exact path="/heads" element={<>Heads</>} />
                <Route exact path="/test" element={<>Test</>} />
                <Route exact path="/tests" element={<>Tests</>} />
                <Route exact path="/main" element={<>Main</>} />
                <Route exact path="/mess" element={<>Mess</>} />
                <Route
                  exact
                  path="/online"
                  element={
                    <>
                      <div>Online</div>
                      <Link to="/online/nav1">Nav1</Link>
                    </>
                  }
                />
                <Route
                  exact
                  path="/online/nav1"
                  element={
                    <>
                      <div>Nav1</div>
                      <Link to="/online/nav1/nav2">Nav2</Link>
                    </>
                  }
                />
                <Route exact path="/online/nav1/nav2" element={<>Nav2</>} />
                <Route
                  exact
                  path="/NavigationMaster/Role/New"
                  element={<RoleForm />}
                />
                <Route
                  exact
                  path="/NavigationMaster/Role/Update/:id"
                  element={<RoleForm />}
                />
              </>
            </Route>
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
