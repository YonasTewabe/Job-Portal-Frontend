import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { toast } from "react-toastify";
import { Page, Card, Badge, Table, Tr, Td, Empty } from "../Components/ui";
import { FaBriefcase, FaEnvelope, FaPlus } from "react-icons/fa";

const StatCard = ({ icon, label, value }) => (
  <Card className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </Card>
);

const CompanyDashboard = () => {
  const { user: authUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?.role !== "company_admin") return;
    axios.get("/api/companies/mine")
      .then(({ data }) => { setCompany(data); setJobs(data.jobs ?? []); })
      .catch(() => toast.error("Failed to load company data"))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (authUser?.role !== "company_admin") return <UnauthorizedAccess />;
  if (loading) return <div className="py-20"><Spinner loading /></div>;

  const headers = [
    { label: "Title",    key: "title" },
    { label: "Type",     key: "type" },
    { label: "Location", key: "location" },
    { label: "Deadline", key: "deadline" },
    { label: "Actions",  key: "actions" },
  ];

  return (
    <Page className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company?.name}</h1>
          {company?.description && (
            <p className="text-sm text-gray-500 mt-1 max-w-lg">{company.description}</p>
          )}
        </div>
        <Link to="/add-job" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition">
          <FaPlus size={12} /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<FaBriefcase size={18} />} label="Jobs Posted"    value={jobs.length} />
        <StatCard icon={<FaEnvelope  size={18} />} label="Contact Email"  value={company?.contactEmail ?? "—"} />
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <span className="text-lg font-bold">#</span>
          </div>
          <div>
            <Badge status={company?.isActive ? "Active" : "Suspended"} />
            <p className="text-xs text-gray-500 mt-1">Account Status</p>
          </div>
        </Card>
      </div>

      {/* Jobs table */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">Your Job Listings</h2>
      <Card className="p-0 overflow-hidden">
        <Table headers={headers}
          empty={jobs.length === 0
            ? <Empty message="No jobs posted yet." />
            : null}>
          {jobs.map((job, i) => (
            <Tr key={job.id} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{job.title}</Td>
              <Td>{job.type}</Td>
              <Td>{job.location}</Td>
              <Td className="text-gray-500">
                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "—"}
              </Td>
              <Td>
                <div className="flex gap-3">
                  <Link to={`/job/${job.id}`}   className="text-xs text-blue-600 hover:underline">View</Link>
                  <Link to={`/edit-job/${job.id}`} className="text-xs text-yellow-600 hover:underline">Edit</Link>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default CompanyDashboard;
