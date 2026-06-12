import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import axios from "../axiosInterceptor";
import NotFoundPage from "./NotFoundPage";
import SuspendedAccount from "../Components/SuspendedAccount";
import Spinner from "../Components/Spinner";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { useCompany } from "../hooks/useCompany";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";
import { getMinDeadlineDate, isFutureDeadline } from "../utils/jobs";

const AddJob = () => {
  const { user: authUser } = useAuth();
  const myRole    = authUser?.role;
  const navigate  = useNavigate();
  const { setPendingJob } = usePayment();

  const [title,       setTitle]       = useState("");
  const [type,        setType]        = useState("Full-Time");
  const [location,    setLocation]    = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [salary,      setSalary]      = useState("");
  const [deadline,    setDeadline]    = useState("");
  const [postingFee, setPostingFee] = useState(null);

  const { company, isSuspended, loading: companyLoading } = useCompany();
  const companyId = authUser?.companyId ?? company?.id;

  useEffect(() => {
    axios
      .get("/api/pricing")
      .then(({ data }) => setPostingFee(data))
      .catch(() => toast.error("Failed to load posting fee"));
  }, []);

  if (myRole !== "company_admin") return <NotFoundPage />;
  if (companyLoading) return <div className="py-24"><Spinner loading /></div>;
  if (isSuspended) return <SuspendedAccount />;

  const minDeadline = getMinDeadlineDate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyId) {
      toast.error("Company not found. Please log in again.");
      return;
    }
    if (!isFutureDeadline(deadline)) {
      toast.error("Application deadline must be a future date.");
      return;
    }
    const jobData = {
      title,
      type,
      location,
      description,
      requirement,
      deadline,
      companyId,
      ...(salary.trim() ? { salary: salary.trim() } : {}),
    };
    setPendingJob(jobData, postingFee);
    navigate("/pay");
  };

  const jobTypes = ["Full-Time", "Part-Time", "Remote", "Internship"];

  return (
    <FormCard
      title="Post a New Job"
      subtitle={
        postingFee
          ? `Fill in the details below. A posting fee of ${Number(postingFee.jobPostingPrice).toLocaleString()} ${postingFee.currency ?? "ETB"} applies.`
          : "Fill in the details below to publish a new listing."
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Job title" htmlFor="title">
          <input
            id="title" type="text" placeholder="e.g. Front-end Developer" required
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
              placeholder="Leave empty if not specified"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Location" htmlFor="location">
            <input
              id="location" type="text" placeholder="City or Remote" required
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
            id="description" rows={5} placeholder="Duties, expectations, culture…"
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

        <button type="submit" disabled={!postingFee} className={Btn.full("primary", "mt-2 py-3")}>
          Continue to payment
        </button>
      </form>
    </FormCard>
  );
};

export default AddJob;
