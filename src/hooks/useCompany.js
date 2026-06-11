import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";

const COMPANY_ROLES = ["company_admin", "hr"];

export const useCompany = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !COMPANY_ROLES.includes(user.role)) {
      setCompany(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    axios.get("/api/companies/mine")
      .then(({ data }) => { if (!cancelled) setCompany(data); })
      .catch(() => { if (!cancelled) setCompany(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user]);

  const isSuspended = company != null && company.isActive === false;
  const canPostJobs = company != null && company.isActive !== false;

  return { company, loading, isSuspended, canPostJobs };
};
