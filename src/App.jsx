import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
import DesignationMaster from "./pages/masters/DesignationMaster";
import TranscriptMaster from "./pages/masters/TranscriptMaster";
import InventoryMaster from "./pages/masters/InventoryMaster";
import ShiftMaster from "./pages/masters/ShiftMaster";
import InfrastructureMaster from "./pages/masters/InfrastructureMaster";
import AcademicMaster from "./pages/masters/AcademicMaster";
import CandidateWalkinMaster from "./pages/masters/CandidateWalkinMaster";

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

//Designation Master forms
import DesignationForm from "./pages/forms/DesignationMaster/DesignationForm";

//Transcript Master forms
import TranscriptForm from "./pages/forms/TranscriptMaster/TranscriptForm";
import TranscriptAssignmentForm from "./pages/forms/TranscriptMaster/TranscriptAssignmentForm";

// InventoryMaster Forms
import StoreForm from "./pages/forms/Inventory Master/StoreForm";
import MeasureForm from "./pages/forms/Inventory Master/MeasureForm";

// ShiftMaster Forms
import ShiftForm from "./pages/forms/ShiftMaster/ShiftForm";

// InfrastructureMaster Forms
import FacilityForm from "./pages/forms/InfrastructureMaster/FacilityForm";
import BlockForm from "./pages/forms/InfrastructureMaster/BlockForm";
import RoomForm from "./pages/forms/InfrastructureMaster/RoomForm";

// Academic Master forms
import SectionForm from "./pages/forms/AcademicMaster/SectionForm";
import BatchForm from "./pages/forms/AcademicMaster/BatchForm";

// CandidateWalkinMaster Forms
import ApplicationForm from "./pages/forms/CandidateWalkinMaster/ApplicationForm";

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
                  path="/InstituteMaster/School/New"
                  element={<SchoolForm />}
                />
                <Route
                  exact
                  path="/InstituteMaster/School/Update/:id"
                  element={<SchoolForm />}
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
                {/* Designation Master */}
                <Route
                  exact
                  path="/DesignationMaster"
                  element={<DesignationMaster />}
                />
                <Route
                  exact
                  path="/DesignationMaster/Designation/New"
                  element={<DesignationForm />}
                />
                <Route
                  exact
                  path="/DesignationMaster/Designation/Update/:id"
                  element={<DesignationForm />}
                />
                {/* Transcript Master */}

                <Route
                  exact
                  path="/TranscriptMaster"
                  element={<TranscriptMaster />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/Transcript/New"
                  element={<TranscriptForm />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/Transcript/Update/:id"
                  element={<TranscriptForm />}
                />
                <Route
                  exact
                  path="/TranscriptMaster/TranscriptAssignment/Assign"
                  element={<TranscriptAssignmentForm />}
                />

                {/* Inventory Master */}
                <Route
                  exact
                  path="/InventoryMaster"
                  element={<InventoryMaster />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Store/New"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Store/Update/:id"
                  element={<StoreForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measure/New"
                  element={<MeasureForm />}
                />
                <Route
                  exact
                  path="/InventoryMaster/Measure/Update/:id"
                  element={<MeasureForm />}
                />

                {/* Shift Master */}

                <Route exact path="/ShiftMaster" element={<ShiftMaster />} />

                <Route
                  exact
                  path="/ShiftMaster/Shift/New"
                  element={<ShiftForm />}
                />
                <Route
                  exact
                  path="/ShiftMaster/Shift/Update/:id"
                  element={<ShiftForm />}
                />

                {/* Infrastructure Master*/}
                <Route
                  exact
                  path="/InfrastructureMaster"
                  element={<InfrastructureMaster />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Facility/New"
                  element={<FacilityForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Facility/Update/:id"
                  element={<FacilityForm />}
                />

                <Route
                  exact
                  path="/InfrastructureMaster/Block/New"
                  element={<BlockForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Block/Update/:id"
                  element={<BlockForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Rooms/New"
                  element={<RoomForm />}
                />
                <Route
                  exact
                  path="/InfrastructureMaster/Rooms/Update/:id"
                  element={<RoomForm />}
                />
                {/*Academic Master*/}
                <Route
                  exact
                  path="/AcademicMaster"
                  element={<AcademicMaster />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Section/New"
                  element={<SectionForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Section/Update/:id"
                  element={<SectionForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Batch/New"
                  element={<BatchForm />}
                />
                <Route
                  exact
                  path="/AcademicMaster/Batch/Update/:id"
                  element={<BatchForm />}
                />
                {/* CandidateWalkin Master */}
                <Route
                  exact
                  path="/CandidateWalkinMaster"
                  element={<CandidateWalkinMaster />}
                />
                <Route
                  exact
                  path="/CandidateWalkinMaster/Candidate/New"
                  element={<ApplicationForm />}
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
