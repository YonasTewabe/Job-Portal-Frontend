import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { useAuth } from "../context/AuthContext";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const AddJob = ({ addJobSubmit }) => {
  const { user: authUser } = useAuth();
  const myRole   = authUser?.role;
  const companyId = authUser?.companyId;
  const navigate = useNavigate();

  const [title,       setTitle]       = useState("");
  const [type,        setType]        = useState("Full-Time");
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [salary,      setSalary]      = useState("Negotiable");
  const [deadline,    setDeadline]    = useState("");
  const [loading,     setLoading]     = useState(false);

  if (myRole !== "company_admin") return <UnauthorizedAccess />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/jobs", { title, type, location, description, requirement, salary, deadline, companyId });
      if (addJobSubmit) addJobSubmit();
      toast.success("Job posted successfully");
      navigate("/company/dashboard");
    } catch { toast.error("Failed to post job. Please try again."); }
    finally { setLoading(false); }
  };

  const jobTypes   = ["Full-Time", "Part-Time", "Remote", "Internship"];
  const salaryOpts = ["Negotiable","Under 10,000","10,000 - 15,000","15,000 - 20,000","20,000 - 25,000","Over 25,000"];

  return (
    <FormCard title="Post a new job" onSubmit={handleSubmit}>
      <Field label="Job title" htmlFor="title">
        <input id="title" type="text" placeholder="e.g. Front-end Developer" required
          value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls()} />
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
        <input id="location" type="text" placeholder="City or Remote" required
          value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls()} />
      </Field>

      <Field label="Application deadline" htmlFor="deadline">
        <input id="deadline" type="date" required
          value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls()} />
      </Field>

      <Field label="Job description" htmlFor="description">
        <textarea id="description" rows={4} placeholder="Duties, expectations, requirements…"
          value={description} onChange={(e) => setDescription(e.target.value)}
          className={inputCls() + " resize-none"} />
      </Field>

      <Field label="Requirements" htmlFor="requirement">
        <input id="requirement" type="text" placeholder="Experience or education needed" required
          value={requirement} onChange={(e) => setRequirement(e.target.value)} className={inputCls()} />
      </Field>

      <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2")}>
        {loading ? "Posting…" : "Post job"}
      </button>
    </FormCard>
  );
};

export default AddJob;
