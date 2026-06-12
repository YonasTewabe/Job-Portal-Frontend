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
import PaymentCheckout from "./Pages/PaymentCheckout";
import PaymentSuccess from "./Pages/PaymentSuccess";
import PaymentHistory from "./Pages/PaymentHistory";
import SuperAdminPricing from "./Pages/SuperAdminPricing";
import SuperAdminAdmins from "./Pages/SuperAdminAdmins";
import AddSuperAdmin from "./Pages/AddSuperAdmin";
import Login from "./Pages/Login";
import ViewApplicants from "./Pages/ViewApplicants";
import ContactUs from "./Pages/ContactUs";
import AboutUs from "./Pages/AboutUs";
import ViewStatus from "./Pages/ViewStatus";
import Notifications from "./Pages/Notifications";
import ChangePassword from "./Pages/ChangePassword";
import ForgotPassword from "./Pages/ForgotPassword";
import ViewUserList from "./Pages/ViewUserList";

// New role-based dashboards
import SuperAdminDashboard from "./Pages/SuperAdminDashboard";
import SuperAdminCompanies from "./Pages/SuperAdminCompanies";
import SuperAdminCompanyDetail from "./Pages/SuperAdminCompanyDetail";
import AddCompany from "./Pages/AddCompany";
import CompanyDashboard from "./Pages/CompanyDashboard";
import UserDashboard from "./Pages/UserDashboard";
import MyProfile from "./Pages/MyProfile";
import Messages from "./Pages/Messages";

const App = () => {
  const deleteJob = (id) => axios.delete(`/api/jobs/${id}`);
  const updateJob = (job) => axios.patch(`/api/jobs/${job.id}`, job);
  const deleteUser = (id) => axios.delete(`/api/users/${id}`);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="register/company" element={<CompanyRegister />} />
        <Route
          path="pay"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <PaymentCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-success"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="job/:id" element={<Job deleteJob={deleteJob} />} loader={jobLoader} />
        <Route path="*" element={<NotFoundPage />} />

        {/* ── Superadmin ─────────────────────────────────────── */}
        <Route
          path="superadmin/dashboard"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/companies"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <SuperAdminCompanies />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/companies/new"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <AddCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/companies/:id"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <SuperAdminCompanyDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/pricing"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <SuperAdminPricing />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/payments"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/admins"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <SuperAdminAdmins />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/admins/new"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <AddSuperAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="superadmin/applicants"
          element={
            <ProtectedRoute roles={["superadmin"]}>
              <ViewUserList />
            </ProtectedRoute>
          }
        />

        {/* ── Company admin ───────────────────────────────────── */}
        <Route
          path="company/dashboard"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="company/payments"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />

        {/* ── Regular user ────────────────────────────────────── */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        {/* /home redirects to /dashboard for users */}
        <Route
          path="home"
          element={
            <ProtectedRoute roles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <ProtectedRoute>
              <ViewReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="status"
          element={
            <ProtectedRoute>
              <ViewStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="add-job"
          element={
            <ProtectedRoute roles={["company_admin"]}>
              <AddJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-job/:id"
          element={
            <ProtectedRoute>
              <EditJob updateJobSubmit={updateJob} />
            </ProtectedRoute>
          }
          loader={jobLoader}
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/:id"
          element={
            <ProtectedRoute>
              <Account deleteUser={deleteUser} />
            </ProtectedRoute>
          }
          loader={userLoader}
        />
        <Route
          path="UpdateUser/:id"
          element={
            <ProtectedRoute>
              <UpdateUser />
            </ProtectedRoute>
          }
          loader={userLoader}
        />
        <Route
          path="applicants/:id"
          element={
            <ProtectedRoute>
              <ViewApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="changepassword/:id"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
