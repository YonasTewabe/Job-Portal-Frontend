import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "../utils/toast";
import { Page, PageTitle, Card, Badge } from "../Components/ui";
import {
  BuildingIcon,
  BriefcaseIcon,
  UsersIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "../Components/icons";
import { countOpenJobs, isJobOpen, sortJobsByPostedDate, getJobPostedDate } from "../utils/jobs";

const RECENT_LIMIT = 5;

const companyRecency = (company) => {
  const deadlines = (company.jobs ?? [])
    .map((j) => new Date(j.deadline).getTime())
    .filter((t) => !Number.isNaN(t));
  return deadlines.length ? Math.max(...deadlines) : 0;
};

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
        setJobs(sortJobsByPostedDate(Array.isArray(jobsRes.data) ? jobsRes.data : []));
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      })
      .catch(() => toast.error("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (authUser?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const activeCompanies = companies.filter((c) => c.isActive).length;
  const openJobsCount   = countOpenJobs(jobs);
  const recentCompanies = [...companies]
    .sort((a, b) => companyRecency(b) - companyRecency(a))
    .slice(0, RECENT_LIMIT);

  const recentJobs = sortJobsByPostedDate(jobs).slice(0, RECENT_LIMIT);

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
          icon={<BuildingIcon size={18} />}
          label="Total Companies"
          value={companies.length}
          color={{ bg: "bg-brand-50", text: "text-brand-600" }}
        />
        <StatCard
          icon={<CheckCircleIcon size={18} />}
          label="Active Companies"
          value={activeCompanies}
          color={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
        />
        <StatCard
          icon={<BriefcaseIcon size={18} />}
          label="Open Jobs"
          value={openJobsCount}
          color={{ bg: "bg-sky-50", text: "text-sky-600" }}
        />
        <StatCard
          icon={<UsersIcon size={18} />}
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
            <ChevronRightIcon className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>

        <Link to="/jobs" className="group">
          <Card className="flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">Browse All Jobs</p>
              <p className="text-xs text-gray-500 mt-0.5">View every listing on the platform</p>
            </div>
            <ChevronRightIcon className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>
        <Link to="/superadmin/payments" className="group">
          <Card className="flex items-center justify-between hover:shadow-card-hover transition-shadow">
            <div>
              <p className="text-sm font-semibold text-gray-900">Payment History</p>
              <p className="text-xs text-gray-500 mt-0.5">View job posting payments</p>
            </div>
            <ChevronRightIcon className="text-gray-300 group-hover:text-brand-500 transition-colors" size={14} />
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent companies */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-500">Recent Companies</h2>
            <Link to="/superadmin/companies" className="text-xs link-brand">
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
                    <Link
                      to={`/superadmin/companies/${company.id}`}
                      className="text-sm font-semibold text-gray-900 truncate hover:text-brand-700 hover:underline block"
                    >
                      {company.name}
                    </Link>
                    <p className="text-xs text-gray-400 truncate">{company.contactEmail}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-500">
                      {countOpenJobs(company.jobs)} open · {company.jobs?.length ?? 0} total
                    </span>
                    <Badge status={company.isActive ? "Active" : "Suspended"} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent jobs */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-500">Recent Jobs</h2>
            <Link to="/jobs" className="text-xs link-brand">
              View all →
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No jobs posted yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentJobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-3.5 gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/job/${job.id}`}
                      className="text-sm font-semibold text-gray-900 truncate hover:text-brand-700 hover:underline block"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-gray-400 truncate">
                      {job.company?.name ?? "—"}
                      {getJobPostedDate(job)
                        ? ` · Posted ${new Date(getJobPostedDate(job)).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <Badge status={isJobOpen(job) ? "Active" : "Closed"} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Page>
  );
};

export default SuperAdminDashboard;
