import { Link } from "react-router-dom";
import { useCompany } from "../hooks/useCompany";

const suspendedCls = "opacity-50 cursor-not-allowed pointer-events-none";

const PostJobLink = ({ children, className = "", disabledClassName = suspendedCls }) => {
  const { isSuspended, loading, canPostJobs } = useCompany();

  if (loading) {
    return (
      <span className={`${className} ${disabledClassName}`} aria-disabled="true">
        {children}
      </span>
    );
  }

  if (isSuspended || !canPostJobs) {
    return (
      <span
        className={`${className} ${disabledClassName}`}
        title="Posting is disabled while your company account is suspended"
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  return (
    <Link to="/add-job" className={className}>
      {children}
    </Link>
  );
};

export default PostJobLink;
