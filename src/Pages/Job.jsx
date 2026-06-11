/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";
import { Card, Badge, Btn, Page } from "../Components/ui";

const Job = ({ deleteJob }) => {
  const navigate = useNavigate();
  const job = useLoaderData();
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { user: authUser } = useAuth();
  const role   = authUser?.role;
  const userId = authUser?.userId;

  useEffect(() => {
    if (role === "user" && userId) {
      axios.get("/api/applicants/me")
        .then((r) => setApplicantProfile(r.data))
        .catch(() => {});
    }
  }, [role, userId]);

  const isDeadlinePassed = new Date(job.deadline) < new Date();

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await axios.post("/api/applications", {
        jobId: job.id,
        applicantId: applicantProfile?.id ?? userId,
        applicationDate: new Date().toISOString(),
      });
      toast.success("Application submitted");
      navigate("/jobs");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewApplicants = () => Cookies.set("jobId", job.id);

  const onDelete = (jobId) => {
    Swal.fire({
      title: "Delete this job?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteJob(jobId);
        toast.success("Job deleted");
        navigate("/jobs");
      }
    });
  };

  return (
    <Page>
      {/* Back link */}
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
        <FaArrowLeft size={12} /> Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-orange-500" />{job.location}</span>
                  <span className="flex items-center gap-1"><FaDollarSign className="text-green-600" />{job.salary}</span>
                  <span className="flex items-center gap-1"><FaClock className="text-blue-500" />Deadline: {job.deadline}</span>
                </div>
              </div>
              <Badge status={isDeadlinePassed ? "Rejected" : "Active"} />
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
              {job.type}
            </span>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-700 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-gray-700 mb-2">Requirements</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{job.requirement}</p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaBuilding className="text-blue-500" /> Company
            </h2>
            <p className="font-semibold text-gray-900 mb-1">{job.companyName}</p>
            <p className="text-sm text-gray-500 mb-4">{job.companyDescription}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Email:</span> {job.contactEmail}</p>
              <p><span className="font-medium">Phone:</span> +251 {job.companyPhone}</p>
            </div>
          </Card>

          {/* Actions */}
          {role === "user" && (
            <Card>
              {!isDeadlinePassed ? (
                <button onClick={handleApply} disabled={submitting}
                  className={Btn.full("primary")}>
                  {submitting ? "Submitting…" : "Apply Now"}
                </button>
              ) : (
                <button disabled className={Btn.full("danger", "opacity-50 cursor-not-allowed")}>
                  Deadline Passed
                </button>
              )}
            </Card>
          )}

          {role === "company_admin" && (
            <Card className="space-y-3">
              <Link to={`/edit-job/${job.id}`} className={Btn.full("primary")}>Edit Job</Link>
              <Link to={`/applicants/${job.id}`} onClick={handleViewApplicants}
                className={Btn.full("success")}>View Applicants</Link>
              <button onClick={() => onDelete(job.id)} className={Btn.full("danger")}>Delete Job</button>
            </Card>
          )}

          {role === "superadmin" && (
            <Card>
              <button onClick={() => onDelete(job.id)} className={Btn.full("danger")}>Delete Job</button>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};

const jobLoader = async ({ params }) => {
  const res = await axios.get(`/api/jobs/${params.id}`);
  return res.data;
};

export { Job, jobLoader };
export default Job;
