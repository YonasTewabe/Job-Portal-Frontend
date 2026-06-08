import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Layout from "./Components/Layout";
import Jobs from "./Pages/Jobs";
import NotFoundPage from "./Pages/NotFoundPage";
import Job, { jobLoader } from "./Pages/Job";
import AddJob from "./Pages/AddJob";
import EditJob from "./Pages/EditJob";
import ViewReport from "./Pages/ViewReport";
import axios from "./axiosInterceptor";
import Account, { userLoader } from "./Pages/Account";
import UpdateUser from "./Pages/UpdateUser";
import SignUp from "./Pages/SignUp";
import ValidatedLoginForm from "./Pages/Login";
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

const App = () => {
  // Add new job
  const addJob = async (newJob) => {
    await axios.post("/api/jobs", newJob);
  };

  // Deleting job
  const deleteJob = async (id) => {
    await axios.delete(`/api/jobs/${id}`);
  };

  // Updating job
  const updateJob = async (job) => {
    await axios.put(`/api/jobs/${job.id}`, job);
  };

  const deleteUser = async (id) => {
    await axios.delete(`/api/profile/${id}`);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="report" element={<ViewReport />} />
        <Route path="add-job" element={<AddJob addJobSubmit={addJob} />} />
        <Route
          path="UpdateUser/:id"
          element={<UpdateUser />}
          loader={userLoader}
        />
        <Route
          path="CompanyInfo/:id"
          element={<CompanyInfo />}
          loader={userLoader}
        />
        <Route
          path="edit-job/:id"
          element={<EditJob updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route
          path="job/:id"
          element={<Job deleteJob={deleteJob} />}
          loader={jobLoader}
        />
        <Route
          path="account/:id"
          element={<Account deleteUser={deleteUser} />}
          loader={userLoader}
        />
        <Route path="signup" element={<SignUp />} />
        <Route path="login" element={<ValidatedLoginForm />} />
        <Route
          path="applicants/:id"
          element={<ViewApplicants />}
          loader={userLoader}
        />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="status" element={<ViewStatus />} />
        <Route path="add-hr" element={<AddHr />} />
        <Route path="changepassword/:id" element={<ChangePassword />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="view-hr" element={<ViewHrList />} />
        <Route path="view-users" element={<ViewUserList />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
