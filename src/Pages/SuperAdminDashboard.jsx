import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "react-toastify";
import { Page, PageTitle, Card, Badge } from "../Components/ui";
import { FaBuilding, FaBriefcase, FaUsers, FaCheckCircle, FaChevronRight } from "react-icons/fa";

const StatCard = ({ icon, label, value, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${color.bg}`}>
      <span className={color.text}>{icon}</span>
    </div>
    <div>
      <p className={`text-2xl font-extrabold tracking-tight ${color.text}`}>{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  </Card>
);

const SuperAdminDashboard = () => {
  const { user: authUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs]           = useState([]);
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (authUser?.role !== "superadmin") return;
    Promise.all([
      axios.get("/api/companies"),
      axios.get("/api/jobs"),
      axios.get("/api/users?role=user"),
    ])
      .then(([companiesRes, jobsRes, usersRes]) => {
        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (authUser?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const activeCompanies = companies.filter((c) => c.isActive).length;
  const recentCompanies = [...companies]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 5);

  return (
    <Page className="max-w-5xl">
      <div className="mb-8">
        <PageTitle>Platform Dashboard</PageTitle>
        <p className="text-sm text-gray-500 mt-1">
          Overview of companies, jobs, and users across the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<FaBuilding size={18} />}
          label="Total Companies"
          value={companies.length}
          color={{ bg: "bg-brand-50", text: "text-brand-600" }}
        />
        <StatCard
          icon={<FaCheckCircle size={18} />}
          label="Active Companies"
          value={activeCompanies}
          color={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
        />
        <StatCard
          icon={<FaBriefcase size={18} />}
          label="Open Jobs"
          value={jobs.length}
          color={{ bg: "bg-sky-50", text: "text-sky-600" }}
        />
        <StatCard
          icon={<FaUsers size={18} />}
          label="Job Seekers"
          value={users.length}
          color={{ bg: "bg-violet-50", text: "text-violet-600" }}
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/superadmin/companies" className="group">
          <Card className="flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">Manage Companies</p>
              <p className="text-xs text-gray-500 mt-0.5">View, suspend, or add companies</p>
            </div>
            <FaChevronRight className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>
        <Link to="/superadmin/companies/new" className="group">
          <Card className="flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">Add Company</p>
              <p className="text-xs text-gray-500 mt-0.5">Register a new company manually</p>
            </div>
            <FaChevronRight className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>
        <Link to="/jobs" className="group">
          <Card className="flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">Browse All Jobs</p>
              <p className="text-xs text-gray-500 mt-0.5">View every listing on the platform</p>
            </div>
            <FaChevronRight className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>
      </div>

      {/* Recent companies */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-900">Recent Companies</h2>
          <Link
            to="/superadmin/companies"
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentCompanies.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No companies registered yet.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentCompanies.map((company) => (
              <li key={company.id} className="flex items-center justify-between py-3.5 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{company.name}</p>
                  <p className="text-xs text-gray-400 truncate">{company.contactEmail}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500">{company.jobs?.length ?? 0} jobs</span>
                  <Badge status={company.isActive ? "Active" : "Suspended"} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Page>
  );
};

export default SuperAdminDashboard;
