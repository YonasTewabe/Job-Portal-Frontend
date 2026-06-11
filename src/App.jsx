import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";
import axios from "./axiosInterceptor";

// Pages
import LandingPage from "./Pages/LandingPage";
import HomePage from "./Pages/HomePage";
import NotFoundPage from "./Pages/NotFoundPage";
import Jobs from "./Pages/Jobs";
import Job, { jobLoader } from "./Pages/Job";
import AddJob from "./Pages/AddJob";
import EditJob from "./Pages/EditJob";
import ViewReport from "./Pages/ViewReport";
import Account, { userLoader } from "./Pages/Account";
import UpdateUser from "./Pages/UpdateUser";
import SignUp from "./Pages/SignUp";
import CompanyRegister from "./Pages/CompanyRegister";
import Login from "./Pages/Login";
import ViewApplicants from "./Pages/ViewApplicants";
import ContactUs from "./Pages/ContactUs";
import AboutUs from "./Pages/AboutUs";
import ViewStatus from "./Pages/ViewStatus";
import AddHr from "./Pages/AddHr";
import ChangePassword from "./Pages/ChangePassword";
import ForgotPassword from "./Pages/ForgotPassword";
import ViewHrList from "./Pages/ViewHrList";
import CompanyInfo from "./Pages/CompanyInfo";
import ViewUserList from "./Pages/ViewUserList";

// New role-based dashboards
import SuperAdminDashboard from "./Pages/SuperAdminDashboard";
import SuperAdminCompanies from "./Pages/SuperAdminCompanies";
import SuperAdminCompanyDetail from "./Pages/SuperAdminCompanyDetail";
import AddCompany from "./Pages/AddCompany";
import CompanyDashboard from "./Pages/CompanyDashboard";
import UserDashboard from "./Pages/UserDashboard";
import MyProfile from "./Pages/MyProfile";

const App = () => {
  const addJob    = (newJob) => axios.post("/api/jobs", newJob);
  const deleteJob = (id)    => axios.delete(`/api/jobs/${id}`);
  const updateJob = (job)   => axios.patch(`/api/jobs/${job.id}`, job);
  const deleteUser = (id)   => axios.delete(`/api/users/${id}`);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<LandingPage />} />
        <Route path="login"          element={<Login />} />
        <Route path="signup"           element={<SignUp />} />
        <Route path="register/company" element={<CompanyRegister />} />
        <Route path="forgotpassword"   element={<ForgotPassword />} />
        <Route path="contact"        element={<ContactUs />} />
        <Route path="about"          element={<AboutUs />} />
        <Route path="*"              element={<NotFoundPage />} />

        {/* ── Superadmin ─────────────────────────────────────── */}
        <Route
          path="superadmin/dashboard"
          element={<ProtectedRoute roles={["superadmin"]}><SuperAdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="superadmin/companies"
          element={<ProtectedRoute roles={["superadmin"]}><SuperAdminCompanies /></ProtectedRoute>}
        />
        <Route
          path="superadmin/companies/new"
          element={<ProtectedRoute roles={["superadmin"]}><AddCompany /></ProtectedRoute>}
        />
        <Route
          path="superadmin/companies/:id"
          element={<ProtectedRoute roles={["superadmin"]}><SuperAdminCompanyDetail /></ProtectedRoute>}
        />

        {/* ── Company admin ───────────────────────────────────── */}
        <Route
          path="company/dashboard"
          element={<ProtectedRoute roles={["company_admin"]}><CompanyDashboard /></ProtectedRoute>}
        />

        {/* ── Regular user ────────────────────────────────────── */}
        <Route
          path="dashboard"
          element={<ProtectedRoute roles={["user"]}><UserDashboard /></ProtectedRoute>}
        />

        {/* ── Shared protected routes ─────────────────────────── */}
        <Route path="home"       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="jobs"       element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="report"     element={<ProtectedRoute><ViewReport /></ProtectedRoute>} />
        <Route path="status"     element={<ProtectedRoute><ViewStatus /></ProtectedRoute>} />
        <Route path="add-hr"     element={<ProtectedRoute><AddHr /></ProtectedRoute>} />
        <Route path="view-hr"    element={<ProtectedRoute><ViewHrList /></ProtectedRoute>} />
        <Route path="view-users" element={<ProtectedRoute><ViewUserList /></ProtectedRoute>} />

        <Route
          path="add-job"
          element={<ProtectedRoute><AddJob addJobSubmit={addJob} /></ProtectedRoute>}
        />
        <Route
          path="job/:id"
          element={<ProtectedRoute><Job deleteJob={deleteJob} /></ProtectedRoute>}
          loader={jobLoader}
        />
        <Route
          path="edit-job/:id"
          element={<ProtectedRoute><EditJob updateJobSubmit={updateJob} /></ProtectedRoute>}
          loader={jobLoader}
        />
        <Route
          path="profile"
          element={<ProtectedRoute><MyProfile /></ProtectedRoute>}
        />
        <Route
          path="account/:id"
          element={<ProtectedRoute><Account deleteUser={deleteUser} /></ProtectedRoute>}
          loader={userLoader}
        />
        <Route
          path="UpdateUser/:id"
          element={<ProtectedRoute><UpdateUser /></ProtectedRoute>}
          loader={userLoader}
        />
        <Route
          path="CompanyInfo/:id"
          element={<ProtectedRoute><CompanyInfo /></ProtectedRoute>}
          loader={userLoader}
        />
        <Route
          path="applicants/:id"
          element={<ProtectedRoute><ViewApplicants /></ProtectedRoute>}
        />
        <Route
          path="changepassword/:id"
          element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
