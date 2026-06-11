/** Normalize stored paths and resolve fallbacks for older notifications. */
export const resolveNotificationLink = (notification, role) => {
  let path = notification?.linkPath ?? null;

  if (path?.startsWith("/jobs/") && path !== "/jobs") {
    const id = path.slice("/jobs/".length);
    if (id) path = `/job/${id}`;
  }

  if (path) return path;

  const { type, referenceId } = notification ?? {};

  switch (type) {
    case "application_status":
    case "interview_scheduled":
    case "interview_updated":
      return role === "user" ? "/status" : null;
    case "job_closed":
      return referenceId ? `/job/${referenceId}` : "/jobs";
    case "payment_received":
      return role === "superadmin" ? "/superadmin/payments" : null;
    default:
      return null;
  }
};

export const getNotificationHubPath = () => "/notifications";
