export const isJobOpen = (job) => {
  if (!job?.deadline) return true;
  return new Date(job.deadline) >= new Date();
};

export const countOpenJobs = (jobs) => (jobs ?? []).filter(isJobOpen).length;
