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
import AcademicCalendars from "./pages/masters/AcademicCalendars";

// Institute master forms

import SchoolForm from "./pages/forms/SchoolForm";

// Navigation master forms
import ModuleForm from "./pages/forms/ModuleForm";
import MenuForm from "./pages/forms/MenuForm";

import OrganizationForm from "./pages/forms/OrganizationForm";
import JobtypeForm from "./pages/forms/JobtypeForm";
import EmptypeForm from "./pages/forms/EmptypeForm";

import DepartmentForm from "./pages/forms/DepartmentForm";
import DepartmentAssignmentForm from "./pages/forms/DepartmentAssignmentForm";
import ProgramForm from "./pages/forms/ProgramForm";
import ProgramAssignmentForm from "./pages/forms/ProgramAssignmentForm";
import ProgramSpecializationForm from "./pages/forms/ProgramSpecializationForm";
import AcademicyearForm from "./pages/forms/AcademicyearForm";
import FinancialyearForm from "./pages/forms/FinancialyearForm";
import CalenderyearForm from "./pages/forms/CalenderyearForm";
import SubmenuForm from "./pages/forms/SubmenuForm";
import RoleForm from "./pages/forms/RoleForm";

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
                  path="/InstituteMaster/School/New"
                  element={<SchoolForm />}
                />

                <Route
                  exact
                  path="/InstituteMaster/School/Update/:id"
                  element={<SchoolForm />}
                />

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

                {/*Academic Calenders */}

                <Route
                  exact
                  path="/AcademicCalendars"
                  element={<AcademicCalendars />}
                />

                <Route
                  exact
                  path="/AcademicCalendars/Academicyear/New"
                  element={<AcademicyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Academicyear/Update/:id"
                  element={<AcademicyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Financialyear/New"
                  element={<FinancialyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Financialyear/Update/:id"
                  element={<FinancialyearForm />}
                />

                <Route
                  exact
                  path="/AcademicCalendars/Calenderyear/New"
                  element={<CalenderyearForm />}
                />
                <Route
                  exact
                  path="/AcademicCalendars/Calenderyear/Update/:id"
                  element={<CalenderyearForm />}
                />

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
