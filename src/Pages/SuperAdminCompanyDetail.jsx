import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "react-toastify";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Badge } from "../Components/ui";
import { FaArrowLeft, FaUsers } from "react-icons/fa";
import { isJobOpen } from "../utils/jobs";

const SuperAdminCompanyDetail = () => {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [company, setCompany]       = useState(null);
  const [jobs, setJobs]             = useState([]);
  const [applicantCounts, setCounts] = useState({});
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (authUser?.role !== "superadmin" || !id) return;

    const load = async () => {
      try {
        const [companyRes, jobsRes] = await Promise.all([
          axios.get(`/api/companies/${id}`),
          axios.get(`/api/jobs?companyId=${id}`),
        ]);
        const companyData = companyRes.data;
        const jobsData = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        setCompany(companyData);
        setJobs(jobsData);

        const counts = {};
        await Promise.all(
          jobsData.map(async (job) => {
            try {
              const { data } = await axios.get(`/api/applications?jobId=${job.id}`);
              counts[job.id] = Array.isArray(data) ? data.length : 0;
            } catch {
              counts[job.id] = 0;
            }
          })
        );
        setCounts(counts);
      } catch {
        toast.error("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authUser, id]);

  if (authUser?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (!company) return <NotFoundPage />;

  const headers = [
    { label: "Job",        key: "title" },
    { label: "Type",       key: "type" },
    { label: "Location",   key: "location" },
    { label: "Deadline",   key: "deadline" },
    { label: "Status",     key: "status" },
    { label: "Applicants", key: "applicants" },
    { label: "Actions",    key: "actions" },
  ];

  return (
    <Page className="max-w-6xl">
      <Link
        to="/superadmin/companies"
        className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700
          font-medium mb-6 group"
      >
        <FaArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to companies
      </Link>

      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>{company.name}</PageTitle>
          <p className="text-sm text-gray-500 mt-1">{company.contactEmail}</p>
          {company.description && (
            <p className="text-sm text-gray-600 mt-2 max-w-2xl">{company.description}</p>
          )}
        </div>
        <Badge status={company.isActive ? "Active" : "Suspended"} />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Jobs</h2>
          <span className="text-xs text-gray-400">{jobs.length} total</span>
        </div>
        <Table
          headers={headers}
          empty={jobs.length === 0
            ? <Empty message="No jobs posted for this company yet." icon="📝" />
            : null}
        >
          {jobs.map((job, i) => (
            <Tr key={job.id} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{job.title}</Td>
              <Td>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {job.type}
                </span>
              </Td>
              <Td className="text-gray-500 text-xs">{job.location}</Td>
              <Td className="text-gray-400 text-xs">
                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "—"}
              </Td>
              <Td>
                <Badge status={isJobOpen(job) ? "Active" : "Closed"} />
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <FaUsers size={11} className="text-gray-400" />
                  {applicantCounts[job.id] ?? 0}
                </span>
              </Td>
              <Td>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/job/${job.id}`}
                    className="text-xs link-brand"
                  >
                    View
                  </Link>
                  <Link
                    to={`/applicants/${job.id}`}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                  >
                    Applicants
                  </Link>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default SuperAdminCompanyDetail;
