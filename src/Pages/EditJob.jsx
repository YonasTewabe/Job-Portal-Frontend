import { useState } from "react";
import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { useAuth } from "../context/AuthContext";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const EditJob = ({ updateJobSubmit }) => {
  const job = useLoaderData();
  const [title,       setTitle]       = useState(job.title       || "");
  const [type,        setType]        = useState(job.type        || "Full-Time");
  const [location,    setLocation]    = useState(job.location    || "");
  const [description, setDescription] = useState(job.description || "");
  const [requirement, setRequirement] = useState(job.requirement || "");
  const [salary,      setSalary]      = useState(job.salary      || "Negotiable");
  const [deadline,    setDeadline]    = useState(job.deadline    || "");
  const [loading,     setLoading]     = useState(false);

  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { id }   = useParams();

  if (authUser?.role !== "company_admin") return <UnauthorizedAccess />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`/api/jobs/${id}`, { title, type, location, description, requirement, salary, deadline });
      if (updateJobSubmit) updateJobSubmit({ id, title, type, location, description, requirement, salary, deadline });
      toast.success("Job updated successfully");
      navigate(`/job/${id}`);
    } catch { toast.error("Failed to update job. Please try again."); }
    finally { setLoading(false); }
  };

  const jobTypes   = ["Full-Time", "Part-Time", "Remote", "Internship"];
  const salaryOpts = ["Negotiable","Under 10,000","10,000 - 15,000","15,000 - 20,000","20,000 - 25,000","Over 25,000"];

  return (
    <FormCard title="Edit job" onSubmit={handleSubmit}>
      <Field label="Job title" htmlFor="title">
        <input id="title" type="text" required value={title}
          onChange={(e) => setTitle(e.target.value)} className={inputCls()} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Job type" htmlFor="type">
          <select id="type" value={type} onChange={(e) => setType(e.target.value)} className={inputCls()}>
            {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Salary range" htmlFor="salary">
          <select id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} className={inputCls()}>
            {salaryOpts.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Location" htmlFor="location">
        <input id="location" type="text" required value={location}
          onChange={(e) => setLocation(e.target.value)} className={inputCls()} />
      </Field>

      <Field label="Application deadline" htmlFor="deadline">
        <input id="deadline" type="date" required value={deadline}
          onChange={(e) => setDeadline(e.target.value)} className={inputCls()} />
      </Field>

      <Field label="Job description" htmlFor="description">
        <textarea id="description" rows={4} value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputCls() + " resize-none"} />
      </Field>

      <Field label="Requirements" htmlFor="requirement">
        <input id="requirement" type="text" required value={requirement}
          onChange={(e) => setRequirement(e.target.value)} className={inputCls()} />
      </Field>

      <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2")}>
        {loading ? "Saving…" : "Save changes"}
      </button>
    </FormCard>
  );
};

export default EditJob;
