import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  MemoryRouter,
} from "react-router-dom";
import OverlayLoader from "./components/OverlayLoader";
import CreateRefreshmentRequest from "./pages/forms/cateringMaster/refreshmentApprover/CreateRefreshmentRequest.jsx";
import RefreshmentMaster from "./pages/forms/cateringMaster/refreshmentReport/RefreshmentMaster.jsx";
import AttendServiceMaster from "./pages/forms/myRequest/AttendServiceMaster.jsx";
import AttendServiceHistory from "./pages/forms/myRequest/AttendServiceHistory.jsx";
import AttendRequestMaster from "./pages/forms/myRequest/RequestMasterReport.jsx";
import ServiceRequestGraph from "./pages/forms/myRequest/graphView/ServiceRequestGraph.jsx";
import StoreIndentRequests from "./containers/indeces/inventoryMaster/StoreIndentRequests.jsx";

const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FormExample = lazy(() => import("./containers/examples/FormExample"));
const NavigationLayout = lazy(() => import("./layouts/NavigationLayout"));
const SchedulerMaster = lazy(() => import("./components/SchedulerMaster.jsx"));

// Master pages
const NavigationMaster = lazy(() => import("./pages/masters/NavigationMaster"));
const InstituteMaster = lazy(() => import("./pages/masters/InstituteMaster"));

// Navigation Master
const ModuleForm = lazy(() =>
  import("./pages/forms/navigationMaster/ModuleForm")
);
const MenuForm = lazy(() => import("./pages/forms/navigationMaster/MenuForm"));
const SubmenuForm = lazy(() =>
  import("./pages/forms/navigationMaster/SubmenuForm")
);
const RoleForm = lazy(() => import("./pages/forms/navigationMaster/RoleForm"));

// User Creation
const UserForm = lazy(() => import("./pages/forms/UserForm"));
const UserIndex = lazy(() => import("./pages/indeces/UserIndex"));

// Institute Master
const OrganizationForm = lazy(() =>
  import("./pages/forms/instituteMaster/OrganizationForm")
);
const SchoolForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolForm")
);
const JobtypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/JobtypeForm")
);
const EmptypeForm = lazy(() =>
  import("./pages/forms/instituteMaster/EmptypeForm")
);
const GraduationForm = lazy(() =>
  import("./pages/forms/instituteMaster/GraduationForm")
);
const SchoolVisionForm = lazy(() =>
  import("./pages/forms/instituteMaster/SchoolVisionForm")
);

// Shift
const ShiftMaster = lazy(() => import("./pages/masters/ShiftMaster"));
const ShiftForm = lazy(() => import("./pages/forms/shiftMaster/ShiftForm"));

// Candidate Walkin
const CandidateWalkinForm = lazy(() =>
  import("./pages/forms/candidateWalkin/CandidateWalkinForm")
);
const CandidateWalkinIndex = lazy(() =>
  import("./pages/indeces/CandidateWalkinIndex")
);
const PreAdmissionProcessForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreAdmissionProcessForm")
);
const PreGrantApproveMaster = lazy(() =>
  import("./pages/masters/PreGrantApproveMaster")
);
const PreScholarshipApproverForm = lazy(() =>
  import("./pages/forms/candidateWalkin/PreScholarshipApproverForm")
);

// Academic Calendar
const AcademicCalendars = lazy(() =>
  import("./pages/masters/AcademicCalendars")
);
const AcademicyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/AcademicyearForm")
);
const CalenderyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/CalenderyearForm")
);
const FinancialyearForm = lazy(() =>
  import("./pages/forms/academicCalendars/FinancialyearForm")
);

// Academic Master
const AcademicMaster = lazy(() => import("./pages/masters/AcademicMaster"));
const DepartmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentForm")
);
const DepartmentAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/DepartmentAssignmentForm")
);
const ProgramForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramForm")
);
const ProgramAssignmentForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramAssignmentForm")
);
const ProgramSpecializationForm = lazy(() =>
  import("./pages/forms/academicMaster/ProgramSpecializationForm")
);
const VisionMissionForm = lazy(() =>
  import("./pages/forms/academicMaster/VisionMissionForm")
);

// Course Pattern
const CoursePatternIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CoursePatternIndex")
);
const CoursePatternForm = lazy(() =>
  import("./pages/forms/courseMaster/CoursePatternForm")
);

// Course Assignment
const CourseassignmentIndex = lazy(() =>
  import("./containers/indeces/courseMaster/CourseassignmentIndex")
);
const CourseAssignment = lazy(() =>
  import("./pages/forms/courseMaster/CourseAssignment")
);

// Admission Master
const AdmissionMaster = lazy(() => import("./pages/masters/AdmissionMaster"));
const AdmCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmCategoryForm")
);
const AdmSubCategoryForm = lazy(() =>
  import("./pages/forms/admissionMaster/AdmSubcategoryForm")
);
const BoardForm = lazy(() => import("./pages/forms/admissionMaster/BoardForm"));
const CurrencytypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/CurrencyForm")
);
const ProgramtypeForm = lazy(() =>
  import("./pages/forms/admissionMaster/ProgramtypeForm")
);

// Fee Template
const FeetemplateMaster = lazy(() =>
  import("./pages/masters/FeetemplateMaster")
);
const FeeTemplate = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeeTemplate")
);
const FeetemplateSubamount = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubamount")
);
const FeetemplateApprovalIndex = lazy(() =>
  import("./containers/indeces/feetemplateMaster/FeetemplateApprovalIndex")
);
const ViewFeetemplateSubAmount = lazy(() =>
  import("./pages/forms/feetemplateMaster/ViewFeetemplateSubAmount")
);
const FeetemplateAttachmentView = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateAttachmentView")
);
const FeetemplateSubAmountHistory = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateSubAmountHistory")
);
const FeetemplateApproval = lazy(() =>
  import("./pages/forms/feetemplateMaster/FeetemplateApproval")
);

// Account Master
const AccountMaster = lazy(() => import("./pages/masters/AccountMaster"));
const VoucherForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherForm")
);
const VoucherAssignmentForm = lazy(() =>
  import("./pages/forms/accountMaster/VoucherAssignmentForm")
);
const GroupForm = lazy(() => import("./pages/forms/accountMaster/GroupForm"));
const LedgerForm = lazy(() => import("./pages/forms/accountMaster/LedgerForm"));

// Category Type Master
const CategoryTypeMaster = lazy(() =>
  import("./pages/masters/CategoryTypeMaster")
);
const CategoryTypeForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryTypeForm")
);
const CategoryDetailsForm = lazy(() =>
  import("./pages/forms/categoryTypeMaster/CategoryDetailsForm")
);

// Job Portal
const JobPortalIndex = lazy(() => import("./pages/indeces/JobPortalIndex"));
const InterView = lazy(() => import("./pages/forms/jobPortal/InterView"));
const ResultForm = lazy(() => import("./pages/forms/jobPortal/ResultForm"));
const SalaryBreakupForm = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupForm")
);
const OfferForm = lazy(() => import("./pages/forms/jobPortal/OfferForm"));
const RecruitmentForm = lazy(() =>
  import("./pages/forms/jobPortal/RecruitmentForm")
);
const HodCommentsIndex = lazy(() => import("./pages/indeces/HodCommentsIndex"));
const OfferLetterPrint = lazy(() =>
  import("./pages/forms/jobPortal/OfferLetterPrint")
);
const SalaryBreakupPrint = lazy(() =>
  import("./pages/forms/jobPortal/SalaryBreakupPrint")
);
const OfferAccepted = lazy(() =>
  import("./pages/forms/jobPortal/OfferAccepted")
);

// Desgination Master
const DesignationMaster = lazy(() =>
  import("./pages/masters/DesignationMaster")
);
const DesignationForm = lazy(() =>
  import("./pages/forms/designationMaster/DesignationForm")
);

// Salary Master
const SalaryMaster = lazy(() => import("./pages/masters/SalaryMaster"));
const SalaryStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureForm")
);
const SalaryStructureHeadForm = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureHeadForm")
);
const SalaryStructureAssignment = lazy(() =>
  import("./pages/forms/salaryMaster/SalaryStructureAssignment")
);
const SlabStructureForm = lazy(() =>
  import("./pages/forms/salaryMaster/SlabStructureForm")
);

// Mentor Master
const ProctorheadForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorheadForm")
);
const ProctorStudentAssignmentForm = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentAssignmentForm")
);
const ProctorStudentAssignmentIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentAssignmentIndex")
);
const ProctorStudentHistory = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentHistory.jsx")
);
const ProctorMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorMeeting.jsx")
);
const ProctorStudentMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentMeeting.jsx")
);
const ProctorStudentMeetingIndex = lazy(() =>
  import("./containers/indeces/mentorMaster/ProctorStudentMeetingIndex.jsx")
);
const ProctorStudentMaster = lazy(() =>
  import("./pages/masters/ProctorStudentMaster.jsx")
);
const ProctorStudentsMeeting = lazy(() =>
  import("./pages/forms/mentorMaster/ProctorStudentsMeeting.jsx")
);
const MentorMaster = lazy(() => import("./pages/masters/MentorMaster"));

// Employee Master
const EmployeeIndex = lazy(() => import("./pages/indeces/EmployeeIndex"));
const EmployeeUpdateForm = lazy(() =>
  import("./pages/forms/jobPortal/EmployeeUpdateForm")
);
const EmployeeDetailsView = lazy(() =>
  import("./components/EmployeeDetailsView")
);
const EmpAttendanceTrigger = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceTrigger")
);
const ImportBioTrans = lazy(() =>
  import("./pages/forms/employeeMaster/ImportBioTranse")
);
const EmpAttendanceFilterForm = lazy(() =>
  import("./pages/forms/employeeMaster/EmpAttendanceFilterForm")
);
const EmployeeDetailsMaster = lazy(() =>
  import("./pages/masters/EmployeeDetailsMaster.jsx")
);
const EmpDetailsMaster = lazy(() =>
  import("./pages/masters/EmpDetailsMaster.jsx")
);
// Catering Master
const AssignmentDetailsMaster = lazy(() =>
  import("./pages/forms/cateringMaster/AssignmentDetailsMaster")
);
const RefreshmentDetailsMaster = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentApprover/RefreshmentMasterDetails"
  )
);
const RefreshmentTypeForm = lazy(() =>
  import("./pages/forms/cateringMaster/CreateRefreshmentForm")
);
const MessAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MessAssignmentForm.jsx")
);
const MealAssignmentForm = lazy(() =>
  import("./pages/forms/cateringMaster/MealAssignmentForm")
);
const RefreshmentRequestForm = lazy(() =>
  import(
    "./pages/forms/cateringMaster/refreshmentRequest/RefreshmentRequestForm"
  )
);

// Service Request
const ServiceMaster = lazy(() =>
  import("./pages/forms/myRequest/ServiceMaster")
);
const ServiceTypeForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceTypeForm")
);
const ServiceAssignmentForm = lazy(() =>
  import("./pages/forms/myRequest/ServiceAssignmentForm")
);
const ServiceRequestIndex = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequestIndex")
);
const CreateServiceReqForm = lazy(() =>
  import("./pages/forms/myRequest/CreateServiceRequest")
);
const AttendServiceRequest = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequest")
);
const AttendServiceRendorIndex = lazy(() =>
  import("./pages/forms/myRequest/AttendServiceRequestRendorIndex")
);

// Store Indent
const StoreIndentApproverIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentApproverIndex.jsx")
);
const StoreIndentHistory = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentHistory.jsx")
);
const StoreIndent = lazy(() =>
  import("./pages/forms/inventoryMaster/StoreIndent.jsx")
);
const StoreIndentIndex = lazy(() =>
  import("./containers/indeces/inventoryMaster/StoreIndentIndex.jsx")
);

// Leave Master
const LeaveMaster = lazy(() => import("./pages/masters/LeaveMaster"));
const LeaveTypeForm = lazy(() =>
  import("./pages/forms/leaveMaster/LeaveTypeForm")
);

// Infrastructure Master
const InfrastructureMaster = lazy(() =>
  import("./pages/masters/InfrastructureMaster")
);
const FacilityForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/FacilityForm")
);
const BlockForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/BlockForm")
);
const RoomForm = lazy(() =>
  import("./pages/forms/infrastructureMaster/RoomForm")
);

// Inventory Master
const InventoryMaster = lazy(() => import("./pages/masters/InventoryMaster"));
const StoreForm = lazy(() => import("./pages/forms/inventoryMaster/StoreForm"));
const MeasureForm = lazy(() =>
  import("./pages/forms/inventoryMaster/MeasureForm")
);
const VendorForm = lazy(() =>
  import("./pages/forms/inventoryMaster/VendorForm")
);
const ItemCreation = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemCreation.jsx")
);
const ItemAssignemnt = lazy(() =>
  import("./pages/forms/inventoryMaster/ItemAssignment.jsx")
);
const View = lazy(() => import("./pages/forms/inventoryMaster/View"));

function RouteConfig() {
  const token = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.token;

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            token ? (
              <Navigate replace to="/Dashboard" />
            ) : (
              <Navigate replace to="/Login" />
            )
          }
        />

        <Route
          exact
          path="/Login"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <Login />
            </Suspense>
          }
        ></Route>

        <Route
          exact
          path="/ForgotPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ForgotPassword />
            </Suspense>
          }
        />

        <Route
          exact
          path="/ResetPassword"
          element={
            <Suspense fallback={<OverlayLoader />}>
              <ResetPassword />
            </Suspense>
          }
        />

        <Route
          element={
            <Suspense fallback={<OverlayLoader />}>
              <NavigationLayout />
            </Suspense>
          }
        >
          <Route
            exact
            path="/Dashboard"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchedulerMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FormExample"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FormExample />
              </Suspense>
            }
          />
          {/* Navigation Master  */}
          <Route
            exact
            path={"/NavigationMaster"}
            element={<Navigate replace to="/NavigationMaster/Module" />}
          />
          {[
            "/NavigationMaster/Module",
            "/NavigationMaster/Menu",
            "/NavigationMaster/Submenu",
            "/NavigationMaster/Role",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <NavigationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/NavigationMaster/Module/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Module/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ModuleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Menu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Submenu/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SubmenuForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/NavigationMaster/Role/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoleForm />
              </Suspense>
            }
          />
          {/* User Creation  */}
          <Route
            exact
            path="/UserIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/UserForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <UserForm />
              </Suspense>
            }
          />
          {/* Institute Master  */}
          <Route
            exact
            path={"/InstituteMaster"}
            element={<Navigate replace to="/InstituteMaster/Organization" />}
          />
          {[
            "/InstituteMaster/Organization",
            "/InstituteMaster/School",
            "/InstituteMaster/JobType",
            "/InstituteMaster/EmpType",
            "/InstituteMaster/Graduation",
            "/InstituteMaster/Visions",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InstituteMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InstituteMaster/Organization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Organization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OrganizationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/School/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Jobtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Emptype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmptypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/Graduation/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GraduationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InstituteMaster/SchoolVision/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SchoolVisionForm />
              </Suspense>
            }
          />
          {/* Shift   */}
          <Route
            exact
            path="/ShiftMaster"
            element={<Navigate replace to="/ShiftMaster/Shifts" />}
          />
          {["ShiftMaster/Shifts"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ShiftMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/ShiftMaster/Shifts/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ShiftMaster/Shifts/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ShiftForm />
              </Suspense>
            }
          />
          {/* Candidate Walkin  */}
          <Route
            exact
            path="/CandidateWalkinForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CandidateWalkinIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CandidateWalkinIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/PreAdmissionProcessForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreAdmissionProcessForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/PrescholarshipapproverIndex"}
            element={<Navigate replace to="/PreGrantMaster/Approve" />}
          />
          {["/PreGrantMaster/Approve", "/PreGrantMaster/History"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <PreGrantApproveMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/PreScholarshipApproverForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <PreScholarshipApproverForm />
              </Suspense>
            }
          />
          {/* Academic Calendar  */}
          <Route
            exact
            path={"/AcademicCalendars"}
            element={<Navigate replace to="/AcademicCalendars/AcademicYear" />}
          />
          {[
            "/AcademicCalendars/AcademicYear",
            "/AcademicCalendars/FinancialYear",
            "/AcademicCalendars/CalendarYear",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicCalendars />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicCalendars/Academicyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Academicyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AcademicyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Financialyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FinancialyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicCalendars/Calenderyear/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CalenderyearForm />
              </Suspense>
            }
          />
          {/* Academic Master  */}
          <Route
            exact
            path={"/AcademicMaster"}
            element={<Navigate replace to="/AcademicMaster/Department" />}
          />
          {[
            "/AcademicMaster/Department",
            "/AcademicMaster/Assignment",
            "/AcademicMaster/Program",
            "/AcademicMaster/Assign",
            "/AcademicMaster/Specialization",
            "/AcademicMaster/Internal",
            "/AcademicMaster/VisionMissions",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AcademicMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AcademicMaster/Department/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Department/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/DepartmentAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DepartmentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/Program/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramAssignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/ProgramSpecialization/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramSpecializationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AcademicMaster/VisionMission/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VisionMissionForm />
              </Suspense>
            }
          />
          {/* Course Pattern */}
          <Route
            exact
            path="/CoursePatternIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CoursePatternForm/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CoursePatternForm />
              </Suspense>
            }
          />
          {/* Course Assignment  */}
          <Route
            exact
            path="/CourseassignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseassignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CourseAssignment"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CourseAssignment />
              </Suspense>
            }
          />
          {/* Admission Master  */}
          <Route
            exact
            path={"/AdmissionMaster"}
            element={<Navigate replace to="/AdmissionMaster/Course" />}
          />
          {[
            "/AdmissionMaster/Course",
            "/AdmissionMaster/Board",
            "/AdmissionMaster/Category",
            "/AdmissionMaster/Sub",
            "/AdmissionMaster/Currency",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AdmissionMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/AdmissionSubCategory/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AdmSubCategoryForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Board/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BoardForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Currencytype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CurrencytypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AdmissionMaster/Programtype/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProgramtypeForm />
              </Suspense>
            }
          />
          {/* Fee Template  */}
          <Route
            exact
            path="/FeetemplateMaster"
            element={<Navigate replace to="/FeetemplateMaster/Feetemplate" />}
          />
          {["/FeetemplateMaster/Feetemplate", "FeetemplateMaster/Route"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <FeetemplateMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubamount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/EditFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubamount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApprovalIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApprovalIndex />
              </Suspense>
            }
          />
          {/* Account Master  */}
          <Route
            exact
            path={"/AccountMaster"}
            element={<Navigate replace to="/AccountMaster/Group" />}
          />
          {[
            "/AccountMaster/Group",
            "/AccountMaster/Ledger",
            "/AccountMaster/Tallyhead",
            "/AccountMaster/Voucherhead",
            "/AccountMaster/Assignment",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AccountMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/AccountMaster/Voucher/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/VoucherAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Group/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <GroupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Ledger/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LedgerForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/AccountMaster/Voucher/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VoucherForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ViewFeetemplateSubAmount/:id/1"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ViewFeetemplateSubAmount />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateAttachmentView/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateAttachmentView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateMaster/Feetemplate/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeeTemplate />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateSubAmountHistory/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateSubAmountHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/FeetemplateApproval/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FeetemplateApproval />
              </Suspense>
            }
          />
          {/* Category Type Master  */}
          <Route
            exact
            path={"/CategoryTypeMaster"}
            element={
              <Navigate replace to="/CategoryTypeMaster/CategoryTypes" />
            }
          />
          {[
            "/CategoryTypeMaster/CategoryTypes",
            "/CategoryTypeMaster/CategoryDetail",
            "/CategoryTypeMaster/CommencementTypes",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <CategoryTypeMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/CategoryTypeMaster/CategoryTypes/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryDetail/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryDetailsForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CategoryTypeMaster/CategoryDetail/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CategoryDetailsForm />
              </Suspense>
            }
          />
          {/* Job Portal  */}
          <Route
            exact
            path="/JobPortal"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <JobPortalIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Interview/New/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Interview/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <InterView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ResultForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ResultForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupForm/New/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupForm/Update/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferForm/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Recruitment/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RecruitmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/HodComments"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <HodCommentsIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferLetterPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferLetterPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryBreakupPrint/:id/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryBreakupPrint />
              </Suspense>
            }
          />
          <Route
            exact
            path="/OfferAccepted/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <OfferAccepted />
              </Suspense>
            }
          />
          {/* Designation Master  */}
          <Route
            exact
            path="/DesignationMaster"
            element={<Navigate replace to="/DesignationMaster/Designations" />}
          />
          {["DesignationMaster/Designations"].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <DesignationMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/DesignationMaster/Designations/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/DesignationMaster/Designations/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <DesignationForm />
              </Suspense>
            }
          />
          {/* Salary Master  */}
          <Route
            exact
            path={"/SalaryMaster"}
            element={<Navigate replace to="/SalaryMaster/SalaryStructure" />}
          />
          {[
            "/SalaryMaster/SalaryStructure",
            "/SalaryMaster/SalaryHead",
            "/SalaryMaster/Assignment",
            "/SalaryMaster/SlabDefinition",
            "/SalaryMaster/SlabStructure",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <SalaryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructure/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureHead/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureHeadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/SalaryMaster/SalaryStructureAssignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SalaryStructureAssignment />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureForm"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="SlabStructureUpdate/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <SlabStructureForm />
              </Suspense>
            }
          />
          {/* Mentor Master  */}
          <Route
            exact
            path={"/ProctorStudentMaster"}
            element={<Navigate replace to="/ProctorStudentMaster/Proctor" />}
          />
          {[
            "/ProctorStudentMaster/Proctor",
            "/ProctorStudentMaster/History",
            "/ProctorStudentMaster/Meeting",
            "/ProctorStudentMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ProctorStudentMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/ProctorMaster"}
            element={<Navigate replace to="/ProctorMaster/Proctor" />}
          />
          {[
            "/ProctorMaster/Proctor",
            "/ProctorMaster/History",
            "/ProctorMaster/Meeting",
            "/ProctorMaster/Report",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <MentorMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/MentorMaster/Mentor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorMaster/Mentor/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorheadForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorMaster/Proctor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/MentorAssignmentIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentAssignmentIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Proctorstudenthistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentsMeeting"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentsMeeting />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ProctorStudentMeetingIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ProctorStudentMeetingIndex />
              </Suspense>
            }
          />
          {/* Employee Master  */}
          <Route
            exact
            path="/EmployeeIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeUpdateForm/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeUpdateForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetailsView/:userId/:offerId"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsView />
              </Suspense>
            }
          />
          <Route
            exact
            path="/schedulertrigger"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceTrigger />
              </Suspense>
            }
          />
          <Route
            exact
            path="/biotransImport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ImportBioTrans />
              </Suspense>
            }
          />
          <Route
            exact
            path="/Attendancesheet"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpAttendanceFilterForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmployeeDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmployeeDetailsMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/EmpDetails"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <EmpDetailsMaster />
              </Suspense>
            }
          />
          {/* Catering Master  */}
          <Route
            exact
            path={"/CateringMaster"}
            element={
              <Navigate replace to="/CateringMaster/RefreshmentTypeIndex" />
            }
          />
          {[
            "/CateringMaster/RefreshmentTypeIndex",
            "/CateringMaster/MessAssignmentIndex",
            "/CateringMaster/InstituteMealIndex",
            "/CateringMaster/RefreshmentCalenderView",
            "/CateringMaster/RefreshmentRequestIndex",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <AssignmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/RefreshmentDetails"}
            element={
              <Navigate
                replace
                to="/RefreshmentDetails/RefreshmentApproverIndex"
              />
            }
          />
          {[
            "/RefreshmentDetails/RefreshmentApproverIndex",
            "/RefreshmentDetails/RefreshmentMailBox",
            "/RefreshmentDetails/RefreshmentRequestReport",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentDetailsMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentDetails/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateRefreshmentRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentDetails/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateRefreshmentRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentDetails/RefreshmentTypeIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateRefreshmentRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentTypeIndex/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MessAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MessAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/MealAssign/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MealAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/CateringMaster/RefreshmentRequestIndex/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/RefreshmentRequest/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RefreshmentRequestForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={"/RefreshmentMaster"}
            element={
              <Navigate
                replace
                to="/RefreshmentMaster/RefreshmentRequestIndex"
              />
            }
          />
          {[
            "/RefreshmentMaster/RefreshmentRequestIndex",
            "/RefreshmentMaster/RefreshmentRequestReport",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <RefreshmentMaster />
                </Suspense>
              }
            />
          ))}
          {/* Service Request  */}
          <Route
            exact
            path={"/ServiceMaster"}
            element={<Navigate replace to="/ServiceMaster/ServiceTypes" />}
          />
          {[
            "/ServiceMaster/ServiceTypes",
            "/ServiceMaster/ServiceAssignment",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <ServiceMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path={"/ServiceRender"}
            element={<Navigate replace to="/ServiceRender/AttendRequest" />}
          />
          {["/ServiceRender/AttendRequest", "/ServiceRender/AttendHistory"].map(
            (path) => (
              <Route
                exact
                key={path}
                path={path}
                element={
                  <Suspense fallback={<OverlayLoader />}>
                    <AttendServiceMaster />
                  </Suspense>
                }
              />
            )
          )}
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceTypes/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceTypeForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMaster/ServiceAssignment/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceAssignmentForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRequest/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <CreateServiceReqForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/attend"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRequest />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/AttendRequest"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceRendorIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceRender/AttendHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendServiceHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterReport"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <AttendRequestMaster />
              </Suspense>
            }
          />
          <Route
            exact
            path="/ServiceMasterCharts"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ServiceRequestGraph />
              </Suspense>
            }
          />
          {/* Store Indent  */}
          <Route
            exact
            path="/StoreIndentApproverIndex"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentApproverIndex />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StoreIndentHistory"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentHistory />
              </Suspense>
            }
          />
          <Route
            exact
            path="/StoreIndentRequests"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndentRequests />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndent/new"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndentIndex"
            element={<StoreIndentIndex />}
          />
          <Route
            exact
            path="/InventoryMaster/StoreIndent/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreIndent />
              </Suspense>
            }
          />
          {/* Leave Master  */}
          <Route
            exact
            path={"/LeaveMaster"}
            element={<Navigate replace to="/LeaveMaster/LeaveType" />}
          />
          {[
            "/LeaveMaster/LeaveType",
            "/LeaveMaster/LeavePattern",
            "/LeaveMaster/ViewReport",
            "/LeaveMaster/Copy",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <LeaveMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/LeaveMaster/LeaveTypes/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <LeaveTypeForm />
              </Suspense>
            }
          />
          {/* Infrastructure Master  */}
          <Route
            exact
            path={"/InfrastructureMaster"}
            element={<Navigate replace to="/InfrastructureMaster/Facility" />}
          />
          {[
            "/InfrastructureMaster/Facility",
            "/InfrastructureMaster/Block",
            "/InfrastructureMaster/Floor",
            "/InfrastructureMaster/Rooms",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InfrastructureMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InfrastructureMaster/Facility/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Facility/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <FacilityForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Block/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <BlockForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InfrastructureMaster/Rooms/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <RoomForm />
              </Suspense>
            }
          />
          {/* Inventory Master  */}
          <Route
            exact
            path={"/InventoryMaster"}
            element={<Navigate replace to="/InventoryMaster/Stores" />}
          />
          {[
            "/InventoryMaster/Stores",
            "/InventoryMaster/Measures",
            "/InventoryMaster/Vendor",
            "/InventoryMaster/Item",
            "InventoryMaster/InStr",
            "/InventoryMaster/Assignment",
            "/InventoryMaster/Library",
          ].map((path) => (
            <Route
              exact
              key={path}
              path={path}
              element={
                <Suspense fallback={<OverlayLoader />}>
                  <InventoryMaster />
                </Suspense>
              }
            />
          ))}
          <Route
            exact
            path="/InventoryMaster/Stores/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Stores/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <StoreForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Measures/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <MeasureForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Vendor/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <VendorForm />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Item/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemCreation />
              </Suspense>
            }
          />
          <Route
            exact
            path="/InventoryMaster/Assignment/New"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />

          <Route
            exact
            path="/InventoryMaster/Assignment/Update/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <ItemAssignemnt />
              </Suspense>
            }
          />
          <Route
            exact
            path="/VendorIndex/View/:id"
            element={
              <Suspense fallback={<OverlayLoader />}>
                <View />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default RouteConfig;
