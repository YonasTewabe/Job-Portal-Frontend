/** Map nested `company` relation to flat fields used across the UI. */
export const normalizeJob = (job) => {
  if (!job) return job;
  const company = job.company ?? {};
  return {
    ...job,
    companyName: job.companyName ?? company.name ?? "",
    companyDescription: job.companyDescription ?? company.description ?? "",
    contactEmail: job.contactEmail ?? company.contactEmail ?? "",
    companyPhone: job.companyPhone ?? company.phone ?? "",
  };
};

export const normalizeJobs = (jobs) =>
  (Array.isArray(jobs) ? jobs : []).map(normalizeJob);

export const isJobOpen = (job) => {
  if (job?.isOpen === false) return false;
  if (!job?.deadline) return true;
  return new Date(job.deadline) >= new Date();
};

export const countOpenJobs = (jobs) => (jobs ?? []).filter(isJobOpen).length;

/** Earliest allowed deadline for date inputs (tomorrow). */
export const getMinDeadlineDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export const isFutureDeadline = (dateStr) => {
  if (!dateStr) return false;
  const selected = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  return selected > today;
};

export const formatDeadlineForInput = (value) => {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};
