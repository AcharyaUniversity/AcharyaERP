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

import OrganizationCreation from "./containers/Organization/OrganizationCreation";
import OrganizationUpdate from "./containers/Organization/OrganizationUpdate";
import JobtypeCreation from "./containers/JobType/JobtypeCreation";
import JobtypeUpdate from "./containers/JobType/JobtypeUpdate";
import EmptypeCreation from "./containers/EmployeeType/EmptypeCreation";
import EmptypeUpdate from "./containers/EmployeeType/EmptypeUpdate";

import TallyheadCreation from "./containers/TallyHead/TallyheadCreation";
import TallyheadUpdate from "./containers/TallyHead/TallyheadUpdate";
import FinancialyearCreation from "./containers/FinancialYear/FinancialyearCreation";
import FinancialyearUpdate from "./containers/FinancialYear/FinancialyearUpdate";
import VendorCreation from "./containers/Vendor/VendorCreation";
import VendorIndex from "./containers/Vendor/VendorIndex";
import VendorUpdate from "./containers/Vendor/VendorUpdate";
import VendorOb from "./containers/Vendor/VendorOb";
import InstituteMaster from "./pages/InstituteMaster";
import AccountMaster from "./pages/AccountMaster";
import View from "./containers/Vendor/View";
import ModuleCreation from "./containers/Module/ModuleCreation";
import ModuleIndex from "./containers/Module/ModuleIndex";
import ModuleUpdate from "./containers/Module/ModuleUpdate";
import MenuCreation from "./containers/Menu/MenuCreation";
import MenuIndex from "./containers/Menu/MenuIndex";
import MenuUpdate from "./containers/Menu/MenuUpdate";
import SubmenuCreation from "./containers/SubMenu/SubmenuCreation";
import SubmenuIndex from "./containers/SubMenu/SubmenuIndex";
import SubmenuUpdate from "./containers/SubMenu/SubmenuUpdate";
import SchoolForm from "./pages/SchoolForm";
import GroupForm from "./pages/GroupForm";
import LedgerForm from "./pages/LedgerForm";
import TallyheadForm from "./pages/TallyheadForm";
import OrganizationForm from "./pages/OrganizationForm";
import JobtypeForm from "./pages/JobtypeForm";
import EmptypeForm from "./pages/EmptypeForm";
import FinancialyearForm from "./pages/FinancialyearForm";
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
              <Route
                exact
                path="/ModuleCreation"
                element={<ModuleCreation />}
              />
              <Route exact path="/ModuleIndex" element={<ModuleIndex />} />
              <Route
                exact
                path="/ModuleUpdate/:id"
                element={<ModuleUpdate />}
              />

              <Route
                exact
                path="/SubmenuCreation"
                element={<SubmenuCreation />}
              />
              <Route exact path="/SubmenuIndex" element={<SubmenuIndex />} />
              <Route
                exact
                path="/SubmenuUpdate/:id"
                element={<SubmenuUpdate />}
              />

              <Route exact path="/MenuCreation" element={<MenuCreation />} />
              <Route exact path="/MenuIndex" element={<MenuIndex />} />
              <Route exact path="/MenuUpdate/:id" element={<MenuUpdate />} />
              <Route
                exact
                path="/InstituteMaster"
                element={<InstituteMaster />}
              />
              <Route exact path="/AccountMaster" element={<AccountMaster />} />
              <Route
                exact
                path="/VendorIndex/VendorCreation"
                element={<VendorCreation />}
              />
              <Route exact path="/VendorIndex/View/:id" element={<View />} />

              <Route exact path="/VendorIndex" element={<VendorIndex />} />
              <Route
                exact
                path="/VendorIndex/VendorUpdate/:id"
                element={<VendorUpdate />}
              />

              <Route
                exact
                path="/InstituteMaster/Jobtype/New"
                element={<JobtypeForm />}
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

              <Route
                exact
                path="/AccountMaster/Group/New"
                element={<GroupForm />}
              />

              <Route
                exact
                path="/AccountMaster/Group/Update/:id"
                element={<GroupForm />}
              />
              <Route
                exact
                path="/AccountMaster/Ledger/New"
                element={<LedgerForm />}
              />

              <Route
                exact
                path="/AccountMaster/Ledger/Update/:id"
                element={<LedgerForm />}
              />
              <Route
                exact
                path="/AccountMaster/Tallyhead/New"
                element={<TallyheadForm />}
              />

              <Route
                exact
                path="/AccountMaster/Tallyhead/Update/:id"
                element={<TallyheadForm />}
              />
              <Route
                exact
                path="/AccountMaster/Financialyear/New"
                element={<FinancialyearForm />}
              />

              <Route
                exact
                path="/AccountMaster/Financialyear/Update/:id"
                element={<FinancialyearForm />}
              />
              <Route
                exact
                path="/VendorIndex/VendorOb/:id"
                element={<VendorOb />}
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
            </Route>
          </Routes>
        </Router>
      </AlertContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
