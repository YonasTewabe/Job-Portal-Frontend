import { useState } from "react";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import axios from "../axiosInterceptor";
import NotFoundPage from "./NotFoundPage";
import { useAuth } from "../context/AuthContext";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";
import { formatDeadlineForInput, getMinDeadlineDate, isFutureDeadline, isJobDraft } from "../utils/jobs";

const EditJob = ({ updateJobSubmit }) => {
  const job = useLoaderData();
  const [title,       setTitle]       = useState(job.title       || "");
  const [type,        setType]        = useState(job.type        || "Full-Time");
  const [location,    setLocation]    = useState(job.location    || "");
  const [description, setDescription] = useState(job.description || "");
  const [requirement, setRequirement] = useState(job.requirement || "");
  const [salary,      setSalary]      = useState(job.salary      || "");
  const [deadline,    setDeadline]    = useState(formatDeadlineForInput(job.deadline));
  const [loading,     setLoading]     = useState(false);
  const [publishing,  setPublishing]  = useState(false);

  const { user: authUser } = useAuth();
  const isDraft = isJobDraft(job);
  const navigate = useNavigate();
  const { id }   = useParams();

  if (authUser?.role !== "company_admin") return <NotFoundPage />;

  const minDeadline = getMinDeadlineDate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFutureDeadline(deadline)) {
      toast.error("Application deadline must be a future date.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        type,
        location,
        description,
        requirement,
        deadline,
        salary: salary.trim() || null,
      };
      await axios.patch(`/api/jobs/${id}`, payload);
      if (updateJobSubmit) updateJobSubmit({ id, ...payload });
      toast.success("Job updated successfully");
      navigate(`/job/${id}`);
    } catch { toast.error("Failed to update job. Please try again."); }
    finally { setLoading(false); }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await axios.patch(`/api/jobs/${id}/publish`);
      toast.success("Job published successfully");
      navigate("/company/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to publish job");
    } finally {
      setPublishing(false);
    }
  };

  const jobTypes = ["Full-Time", "Part-Time", "Remote", "Internship"];

  return (
    <FormCard
      title={isDraft ? "Edit Draft Job" : "Edit Job"}
      subtitle={isDraft ? "Update this draft, then publish when you are ready." : "Update the details for this listing."}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Job title" htmlFor="title">
          <input
            id="title" type="text" required
            value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls()}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job type" htmlFor="type">
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls()}>
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Salary" htmlFor="salary">
            <input
              id="salary"
              type="text"
              placeholder="e.g. 15,000 - 20,000 ETB"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location" htmlFor="location">
            <input
              id="location" type="text" required
              value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls()}
            />
          </Field>
          <Field label="Application deadline" htmlFor="deadline">
            <input
              id="deadline" type="date" required min={minDeadline}
              value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls()}
            />
          </Field>
        </div>

        <Field label="Job description" htmlFor="description">
          <textarea
            id="description" rows={5}
            value={description} onChange={(e) => setDescription(e.target.value)}
            className={inputCls() + " resize-none"}
          />
        </Field>

        <Field label="Requirements" htmlFor="requirement">
          <textarea
            id="requirement" rows={5} placeholder="Experience or education needed" required
            value={requirement} onChange={(e) => setRequirement(e.target.value)} className={inputCls() + " resize-none"}
          />
        </Field>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button type="submit" disabled={loading} className={Btn.full("primary", "py-3 sm:flex-1")}>
            {loading ? "Saving…" : "Save Changes"}
          </button>
          {isDraft && (
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || loading}
              className={Btn.full("secondary", "py-3 sm:flex-1")}
            >
              {publishing ? "Publishing…" : "Publish job"}
            </button>
          )}
        </div>
      </form>
    </FormCard>
  );
};

export default EditJob;
