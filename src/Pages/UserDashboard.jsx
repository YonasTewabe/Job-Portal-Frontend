import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Badge, Table, Tr, Td, Empty, Btn } from "../Components/ui";
import { FaBriefcase, FaCheckCircle, FaClock, FaComments } from "react-icons/fa";

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

const UserDashboard = () => {
  const { user: authUser }         = useAuth();
  const [applications, setApps]    = useState([]);
  const [loading, setLoading]      = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: applicant } = await axios.get("/api/applicants/me");
        const { data: apps }      = await axios.get(`/api/applications?applicantId=${applicant.id}`);
        setApps(Array.isArray(apps) ? apps : []);
      } catch {
        setApps([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const inProgress = applications.filter(
    (a) => a.status === "Under Consideration" || a.status === "Interview Scheduled"
  ).length;
  const pending = applications.filter((a) => a.status === "Pending").length;

  const headers = [
    { label: "Job",       key: "job" },
    { label: "Company",   key: "company" },
    { label: "Applied",   key: "applied" },
    { label: "Status",    key: "status" },
    { label: "Interview", key: "interview" },
    { label: "Chat",      key: "chat" },
  ];

  return (
    <Page>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <PageTitle>Welcome back, {authUser?.name || "there"} 👋</PageTitle>
          <p className="text-sm text-gray-500 mt-1">Here's a summary of your job search activity.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to="/messages" className={Btn.secondary("gap-2 px-4 py-2.5 text-sm")}>
            <FaComments size={13} /> Messages
          </Link>
          <Link to="/jobs" className="btn-primary px-4 py-2.5">
            <FaBriefcase size={13} /> Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<FaBriefcase size={18} />}
          label="Total Applications"
          value={applications.length}
          color={{ bg: "bg-brand-50", text: "text-brand-600" }}
        />
        <StatCard
          icon={<FaCheckCircle size={18} />}
          label="In Progress"
          value={inProgress}
          color={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
        />
        <StatCard
          icon={<FaClock size={18} />}
          label="Pending Review"
          value={pending}
          color={{ bg: "bg-amber-50", text: "text-amber-500" }}
        />
      </div>

      {/* Applications table */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Your Applications</h2>
        <span className="text-xs text-gray-400">{applications.length} total</span>
      </div>
      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={applications.length === 0
            ? <Empty message="You haven't applied to any jobs yet." icon="📋" />
            : null}
        >
          {applications.map((app, i) => (
            <Tr key={app.id ?? i} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{app.job?.title ?? app.jobtitle ?? "—"}</Td>
              <Td className="text-gray-600">{app.job?.company?.name ?? app.companyname ?? "—"}</Td>
              <Td className="text-gray-400 text-xs">
                {app.applicationDate
                  ? new Date(app.applicationDate).toLocaleDateString()
                  : app.applicationdate ?? "—"}
              </Td>
              <Td><Badge status={app.status} /></Td>
              <Td className="text-xs text-gray-400">
                {app.status === "Interview Scheduled" && app.interviewDate
                  ? `${app.interviewHasTime
                      ? new Date(app.interviewDate).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                      : new Date(app.interviewDate).toLocaleDateString([], { dateStyle: "short" })
                    } — ${app.interviewLocation ?? ""}`
                  : "—"}
              </Td>
              <Td>
                <Link
                  to={`/messages?applicationId=${app.id}`}
                  className={Btn.ghost("gap-1.5 text-xs py-1.5 px-3")}
                >
                  <FaComments size={12} /> Message
                </Link>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default UserDashboard;
