import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "react-toastify";
import { Page, Card, Badge, Table, Tr, Td, Empty, Btn } from "../Components/ui";
import { FaBriefcase, FaEnvelope, FaPlus } from "react-icons/fa";
import PostJobLink from "../Components/PostJobLink";
import { getJobListingStatus, isJobDraft, sortJobsByPostedDate } from "../utils/jobs";

const StatCard = ({ icon, label, value, color = { bg: "bg-brand-50", text: "text-brand-600" } }) => (
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

const CompanyDashboard = () => {
  const { user: authUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);

  const loadCompany = () => {
    return axios.get("/api/companies/mine")
      .then(({ data }) => {
        setCompany(data);
        setJobs(sortJobsByPostedDate(data.jobs ?? []));
      });
  };

  useEffect(() => {
    if (authUser?.role !== "company_admin") return;
    loadCompany()
      .catch(() => toast.error("Failed to load company data"))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (authUser?.role !== "company_admin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const sortedJobs = sortJobsByPostedDate(jobs);
  const publishedCount = sortedJobs.filter((job) => !isJobDraft(job)).length;
  const draftCount = sortedJobs.filter(isJobDraft).length;

  const handlePublish = async (jobId) => {
    setPublishingId(jobId);
    try {
      await axios.patch(`/api/jobs/${jobId}/publish`);
      toast.success("Job published");
      await loadCompany();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to publish job");
    } finally {
      setPublishingId(null);
    }
  };

  const headers = [
    { label: "Title",    key: "title" },
    { label: "Status",   key: "status" },
    { label: "Type",     key: "type" },
    { label: "Location", key: "location" },
    { label: "Deadline", key: "deadline" },
    { label: "",         key: "actions" },
  ];

  return (
    <Page className="max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{company?.name}</h1>
          {company?.description && (
            <p className="text-sm text-gray-500 mt-1.5 max-w-lg leading-relaxed">{company.description}</p>
          )}
        </div>
        <PostJobLink className="btn-primary px-4 py-2.5">
          <FaPlus size={11} /> Post a Job
        </PostJobLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<FaBriefcase size={18} />}
          label="Published Jobs"
          value={publishedCount}
          color={{ bg: "bg-brand-50", text: "text-brand-600" }}
        />
        <StatCard
          icon={<FaBriefcase size={18} />}
          label="Draft Jobs"
          value={draftCount}
          color={{ bg: "bg-violet-50", text: "text-violet-600" }}
        />
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
            <span className="text-lg">🏢</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Account Status</p>
            <Badge status={company?.isActive ? "Active" : "Suspended"} />
          </div>
        </Card>
      </div>

      <div className="mb-10">
        <Link
          to="/company/payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800"
        >
          View payment history →
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Job Listings</h2>
        <span className="text-xs text-gray-400">{sortedJobs.length} total</span>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={sortedJobs.length === 0 ? <Empty message="No jobs posted yet." icon="📝" /> : null}
        >
          {sortedJobs.map((job, i) => {
            const draft = isJobDraft(job);
            return (
              <Tr key={job.id} striped={i % 2 !== 0}>
                <Td className="font-medium text-gray-900">{job.title}</Td>
                <Td>
                  <Badge status={getJobListingStatus(job)} />
                </Td>
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
                  <div className="flex items-center gap-3 flex-wrap">
                    {!draft && (
                      <Link to={`/job/${job.id}`} className="text-xs link-brand">
                        View
                      </Link>
                    )}
                    <Link to={`/edit-job/${job.id}`} className="text-xs text-amber-600 hover:text-amber-700 font-semibold hover:underline">
                      Edit
                    </Link>
                    {draft && (
                      <button
                        type="button"
                        onClick={() => handlePublish(job.id)}
                        disabled={publishingId === job.id}
                        className={Btn.primary("text-xs py-1.5 px-3")}
                      >
                        {publishingId === job.id ? "Publishing…" : "Publish"}
                      </button>
                    )}
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Card>
    </Page>
  );
};

export default CompanyDashboard;
