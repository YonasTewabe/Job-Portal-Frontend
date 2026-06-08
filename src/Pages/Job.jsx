/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
const Job = ({ deleteJob }) => {
  const navigate = useNavigate();
  const job = useLoaderData();
  const [user, setUser] = useState(null);

  const { user: authUser } = useAuth();
  const role = authUser?.role;
  const userId = authUser?.userId;

  if (userId && !user) {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/profile/${userId}`);
        if (res.status === 200) {
          setUser(res.data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Fetch user data error:", error);
      }
    };
    fetchUser();
  }

  const Datenow = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const fullname = user ? user.fullname : "";
  const jobtitle = job.title;
  const companyname = job.companyName;
  const applicationdate = Datenow;
  const status = "Pending";
  const contactemail = user ? user.email : "";
  const userphone = user ? user.userPhone : "";
  const university = user ? user.university : "";
  const degree = user ? user.degree : "";
  const experience = user ? user.experience : "";
  const jobid = job.id;
  const userid = user ? user.id : "";
  const cv = user ? user.cv : "";

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const existingApplication = await axios.get(
        `/api/application/check/${jobid}/${userid}`
      );
      if (existingApplication.data) {
        throw new Error("You have already applied to this job");
      }

      await axios.post("/api/application/apply", {
        jobtitle,
        companyname,
        fullname,
        applicationdate,
        status,
        contactemail,
        jobid,
        userphone,
        degree,
        university,
        experience,
        userid,
        cv,
      });

      toast.success("Application submitted successfully");
      navigate("/jobs");
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
      console.error("Application submit error:", error);
    }
  };

  const isDeadlinePassed = new Date(job.deadline) < new Date();

  const handleViewApplicants = () => {
    Cookies.set("jobId", job.id); // Set the job ID to cookies
  };

  const onDeleteClick = (jobId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteJob(jobId);
        toast.success("Job Deleted Successfully");
        navigate("/jobs");
      }
    });
  };

  return (
    <>
      <section>
        <br /> <br />
        <div className="container m-auto py-6 px-6">
          <Link
            to="/jobs"
            className="text-indigo-500 hover:text-indigo-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Job Listings
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <div className="text-gray-500 text-2xl mb-4">{job.type}</div>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <FaMapMarker className="text-orange-700 mr-1" />
                  <p className="text-orange-700">{job.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl"> Job Description:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.description}
                </p>

                <h3 className="text-xl"> Job Requirement:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.requirement}
                </p>

                <h3 className="text-xl"> Salary:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">{job.salary}</p>

                <h3 className="text-xl"> Deadline:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.deadline}
                </p>
              </div>
            </main>

            {/* Sidebar */}
            <aside>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Company Info</h3>
                <h3 className="text-xl">Company Name:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.companyName}
                </p>
                <h3 className="text-xl"> Company Description:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.companyDescription}
                </p>

                <hr className="my-4" />

                <h3 className="text-xl">Contact Email:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {job.contactEmail}
                </p>

                <h3 className="text-xl">Contact Phone:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  +251 {job.companyPhone}
                </p>
              </div>
            </aside>
          </div>

          {/* Manage Job Section */}
          {role == "hr" && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <Link
                to={`/edit-job/${job.id}`}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                Edit Job
              </Link>
              <Link
                to={`/applicants/${job.id}`}
                onClick={handleViewApplicants}
                className="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                View Applicants
              </Link>

              <button
                onClick={() => onDeleteClick(job.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                Delete Job
              </button>
            </div>
          )}

          {role == "admin" && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <button
                onClick={() => onDeleteClick(job.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >
                Delete Job
              </button>
            </div>
          )}

          {role == "user" && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              {!isDeadlinePassed ? (
                <button
                  onClick={submitForm}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Apply Job
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white font-bold py-2 px-4 rounded-full w-full cursor-not-allowed opacity-50 mt-4 block"
                  disabled
                >
                  Deadline Passed
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const jobLoader = async ({ params }) => {
  const res = await axios.get(`/api/jobs/${params.id}`);
  return res.data;
};

export { Job, jobLoader };
export default Job;
