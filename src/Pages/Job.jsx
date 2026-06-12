/* eslint-disable react-refresh/only-export-components */
import { useLoaderData, Link, useNavigate, useRevalidator } from "react-router-dom";
import { loginRedirectState } from "../utils/authNavigation";
import {
  ArrowLeftIcon,
  MapPinIcon,
  ClockIcon,
  DollarIcon,
  BuildingIcon,
  PhoneIcon,
  MailIcon,
} from "../Components/icons";
import axios from "../axiosInterceptor";
import { toast } from "../utils/toast";
import { confirm, confirmDelete, confirmAction, showValidationMessage } from "../utils/confirm";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, Badge, Btn, Page } from "../Components/ui";
import {
  getMinDeadlineDate,
  isDeadlinePassed,
  isFutureDeadline,
  isJobOpen,
  normalizeJob,
} from "../utils/jobs";
const Job = ({ deleteJob }) => {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const job = useLoaderData();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [togglingOpen, setTogglingOpen] = useState(false);

  const { user: authUser } = useAuth();
  const role   = authUser?.role;
  const userId = authUser?.userId;

  useEffect(() => {
    if (role !== "user" || !userId) return;

    let cancelled = false;
    setProfileLoading(true);

    const load = async () => {
      try {
        const [{ data: profileList }, { data: apps }] = await Promise.all([
          axios.get("/api/applicants/me/profiles"),
          axios.get(`/api/applications?userId=${userId}`),
        ]);
        if (cancelled) return;

        const list = Array.isArray(profileList) ? profileList : [];
        setProfiles(list);

        const completeProfiles = list.filter((p) => p.profileCompleted);
        const defaultProfile = completeProfiles[0] ?? list[0] ?? null;
        setSelectedProfileId(defaultProfile?.id ?? null);

        const applications = Array.isArray(apps) ? apps : [];
        const match = applications.find(
          (app) => (app.job?.id ?? app.jobId) === job.id
        );
        setAlreadyApplied(!!match);
        setApplicationId(match?.id ?? null);
      } catch {
        if (!cancelled) {
          setProfiles([]);
          setSelectedProfileId(null);
          setAlreadyApplied(false);
          setApplicationId(null);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [role, userId, job.id]);

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId) ?? null;
  const completeProfiles = profiles.filter((p) => p.profileCompleted);
  const hasCompleteProfile = completeProfiles.length > 0;
  const profileComplete = selectedProfile?.profileCompleted === true;
  const showProfilePicker = completeProfiles.length > 1;

  const jobOpen = isJobOpen(job);

  const handleApply = async () => {
    if (alreadyApplied) return;
    if (!profileComplete || !selectedProfile?.id) {
      toast.error("Complete your profile before applying");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/api/applications", {
        jobId: job.id,
        applicantId: selectedProfile.id,
        applicationDate: new Date().toISOString(),
      });
      toast.success("Application submitted");
      setAlreadyApplied(true);
      navigate("/status");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const patchJobStatus = async (payload) => {
    setTogglingOpen(true);
    try {
      await axios.patch(`/api/jobs/${job.id}`, payload);
      toast.success(payload.isOpen ? "Job reopened" : "Job closed");
      revalidate();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to update job status");
    } finally {
      setTogglingOpen(false);
    }
  };

  const onToggleOpen = async () => {
    const closing = jobOpen;

    if (closing) {
      const result = await confirmAction({
        title: "Close this job?",
        text: "Applicants will no longer be able to apply, even before the deadline.",
        confirmText: "Yes, close it",
      });
      if (!result.isConfirmed) return;
      await patchJobStatus({ isOpen: false });
      return;
    }

    if (isDeadlinePassed(job.deadline)) {
      const result = await confirm({
        title: "Set a new deadline",
        text: "The application deadline has passed. Choose a new date to reopen this job.",
        input: "date",
        inputAttributes: { min: getMinDeadlineDate() },
        inputValue: getMinDeadlineDate(),
        icon: "question",
        confirmButtonText: "Reopen job",
        preConfirm: (value) => {
          if (!isFutureDeadline(value)) {
            showValidationMessage("Please select a future deadline");
            return false;
          }
          return value;
        },
      });
      if (!result.isConfirmed) return;
      await patchJobStatus({ isOpen: true, deadline: result.value });
      return;
    }

    const result = await confirmAction({
      title: "Reopen this job?",
      text: "Applicants can apply again until the deadline.",
      confirmText: "Yes, reopen it",
    });
    if (!result.isConfirmed) return;
    await patchJobStatus({ isOpen: true });
  };

  const onDelete = async (jobId) => {
    const result = await confirmDelete({
      title: "Delete this job?",
      text: "This cannot be undone.",
    });
    if (result.isConfirmed) {
      await deleteJob(jobId);
      toast.success("Job deleted");
      navigate("/jobs");
    }
  };

  return (
    <Page>
      {/* Back link */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm link-brand mb-6 group"
      >
        <ArrowLeftIcon size={11} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title card */}
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{job.title}</h1>
              </div>
              <Badge status={jobOpen ? "Active" : "Closed"} />
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                border border-gray-100 px-3 py-1 rounded-full">
                <MapPinIcon className="text-orange-400" size={10} />{job.location}
              </span>
              {job.salary && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                  border border-gray-100 px-3 py-1 rounded-full">
                  <DollarIcon className="text-emerald-500" size={10} />{job.salary}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50
                border border-gray-100 px-3 py-1 rounded-full">
                <ClockIcon className="text-brand-400" size={10} />Deadline: {job.deadline}
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
                <BuildingIcon className="text-brand-500" size={15} />
              </div>
              <h2 className="text-sm font-semibold text-gray-700">Company</h2>
            </div>

            <p className="font-semibold text-gray-900 mb-0.5">{job.companyName}</p>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{job.companyDescription}</p>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <MailIcon className="text-gray-400 shrink-0" size={11} />
                <span>{job.contactEmail || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="text-gray-400 shrink-0" size={11} />
                <span>{job.companyPhone ? `+251 ${job.companyPhone}` : "—"}</span>
              </div>
            </div>
          </Card>

          {/* Apply / Actions */}
          {!authUser && jobOpen && (
            <Card>
              <Link
                to="/login"
                state={loginRedirectState(`/job/${job.id}`)}
                className={Btn.full("primary", "py-3 text-center block")}
              >
                Apply Now
              </Link>
              <p className="text-xs text-gray-500 text-center mt-3">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  state={loginRedirectState(`/job/${job.id}`)}
                  className="link-brand text-xs"
                >
                  Sign up
                </Link>
              </p>
            </Card>
          )}

          {!authUser && !jobOpen && (
            <Card>
              <button disabled className={Btn.full("danger", "opacity-50 cursor-not-allowed py-3")}>
                {job.isOpen === false ? "Applications Closed" : "Deadline Passed"}
              </button>
            </Card>
          )}

          {role === "user" && (
            <Card>
              {jobOpen ? (
                profileLoading ? (
                  <button disabled className={Btn.full("primary", "opacity-50 cursor-not-allowed py-3")}>
                    Loading…
                  </button>
                ) : alreadyApplied ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled
                      className={Btn.full("secondary", "opacity-60 cursor-not-allowed py-3")}
                    >
                      Already Applied
                    </button>
                    <Link to="/status" className={Btn.ghost("w-full py-2.5 text-center block")}>
                      View application status
                    </Link>
                    {applicationId && (
                      <Link
                        to={`/messages?applicationId=${applicationId}`}
                        className={Btn.secondary("w-full py-2.5 text-center block")}
                      >
                        Message employer
                      </Link>
                    )}
                  </div>
                ) : hasCompleteProfile ? (
                  <div className="space-y-3">
                    {showProfilePicker && (
                      <div>
                        <label htmlFor="apply-profile" className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Apply with profile
                        </label>
                        <select
                          id="apply-profile"
                          value={selectedProfileId ?? ""}
                          onChange={(e) => setSelectedProfileId(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800
                            focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                        >
                          {completeProfiles.map((profile) => (
                            <option key={profile.id} value={profile.id}>
                              {profile.profileName || profile.fullname || "Profile"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {profileComplete ? (
                      <button
                        onClick={handleApply}
                        disabled={submitting}
                        className={Btn.full("primary", "py-3")}
                      >
                        {submitting ? "Submitting…" : "Apply Now"}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The selected profile is incomplete. Choose another profile or complete it first.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Complete your profile before applying.
                    </p>
                    <Link to="/profile" className={Btn.full("primary", "py-3")}>
                      Complete profile
                    </Link>
                  </div>
                )
              ) : (
                <button disabled className={Btn.full("danger", "opacity-50 cursor-not-allowed py-3")}>
                  {job.isOpen === false ? "Applications Closed" : "Deadline Passed"}
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
              <button
                type="button"
                onClick={onToggleOpen}
                disabled={togglingOpen}
                className={Btn.full(jobOpen ? "warning" : "secondary")}
              >
                {togglingOpen ? "Updating…" : jobOpen ? "Close Job" : "Reopen Job"}
              </button>
              <button onClick={() => onDelete(job.id)} className={Btn.full("danger")}>Delete Job</button>
            </Card>
          )}

          {role === "superadmin" && (
            <Card className="space-y-3">
              <Link to={`/applicants/${job.id}`} className={Btn.full("success")}>
                View Applicants
              </Link>
              <button
                type="button"
                onClick={onToggleOpen}
                disabled={togglingOpen}
                className={Btn.full(jobOpen ? "warning" : "secondary")}
              >
                {togglingOpen ? "Updating…" : jobOpen ? "Close Job" : "Reopen Job"}
              </button>
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
  return normalizeJob(res.data);
};

export { Job, jobLoader };
export default Job;
