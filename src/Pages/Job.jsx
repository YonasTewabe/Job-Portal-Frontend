/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, FaPhone, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
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

  const onDelete = (jobId) => {
    Swal.fire({
      title: "Delete this job?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
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
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700
          font-medium mb-6 group"
      >
        <FaArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title card */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1">{job.companyName}</p>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
              </div>
              <Badge status={isDeadlinePassed ? "Rejected" : "Active"} />
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                border border-gray-100 px-3 py-1 rounded-full">
                <FaMapMarkerAlt className="text-orange-400" size={10} />{job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                border border-gray-100 px-3 py-1 rounded-full">
                <FaDollarSign className="text-emerald-500" size={10} />{job.salary}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                border border-gray-100 px-3 py-1 rounded-full">
                <FaClock className="text-brand-400" size={10} />Deadline: {job.deadline}
              </span>
              <span className="inline-flex items-center text-xs font-semibold bg-brand-50 text-brand-700
                border border-brand-100 px-3 py-1 rounded-full">
                {job.type}
              </span>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </Card>

          {/* Requirements */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Requirements</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{job.requirement}</p>
          </Card>
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Company info */}
          <Card>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                <FaBuilding className="text-brand-500" size={15} />
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Company</h2>
            </div>

            <p className="font-semibold text-gray-900 mb-0.5">{job.companyName}</p>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{job.companyDescription}</p>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400 shrink-0" size={11} />
                <span>{job.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-gray-400 shrink-0" size={11} />
                <span>+251 {job.companyPhone}</span>
              </div>
            </div>
          </Card>

          {/* Apply / Actions */}
          {role === "user" && (
            <Card>
              {!isDeadlinePassed ? (
                <button
                  onClick={handleApply}
                  disabled={submitting}
                  className={Btn.full("primary", "py-3")}
                >
                  {submitting ? "Submitting…" : "Apply Now"}
                </button>
              ) : (
                <button disabled className={Btn.full("danger", "opacity-50 cursor-not-allowed py-3")}>
                  Deadline Passed
                </button>
              )}
            </Card>
          )}

          {role === "company_admin" && (
            <Card className="space-y-3">
              <Link to={`/edit-job/${job.id}`} className={Btn.full("primary")}>Edit Job</Link>
              <Link to={`/applicants/${job.id}`} className={Btn.full("success")}>
                View Applicants
              </Link>
              <button onClick={() => onDelete(job.id)} className={Btn.full("danger")}>Delete Job</button>
            </Card>
          )}

          {role === "superadmin" && (
            <Card className="space-y-3">
              <Link to={`/applicants/${job.id}`} className={Btn.full("success")}>
                View Applicants
              </Link>
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
