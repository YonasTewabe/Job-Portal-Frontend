import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import { Page, Card, Badge, Table, Tr, Td, Empty, PageTitle } from "../Components/ui";
import { FaBriefcase } from "react-icons/fa";

const UserDashboard = () => {
  const { user: authUser }          = useAuth();
  const [applications, setApps]     = useState([]);
  const [loading,      setLoading]  = useState(true);

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

  if (loading) return <div className="py-20"><Spinner loading /></div>;

  const headers = [
    { label: "Job",       key: "job" },
    { label: "Company",   key: "company" },
    { label: "Applied",   key: "applied" },
    { label: "Status",    key: "status" },
    { label: "Interview", key: "interview" },
  ];

  return (
    <Page>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <PageTitle>Welcome back, {authUser?.name || "there"} 👋</PageTitle>
        <Link to="/jobs"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition">
          <FaBriefcase size={13} /> Browse Jobs
        </Link>
      </div>

      {/* Quick stat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Applications</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter((a) => a.status === "Under Consideration" || a.status === "Interview Scheduled").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">In Progress</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold text-yellow-500">
            {applications.filter((a) => a.status === "Pending").length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Pending Review</p>
        </Card>
      </div>

      <h2 className="text-base font-semibold text-gray-700 mb-3">Your Applications</h2>
      <Card className="p-0 overflow-hidden">
        <Table headers={headers}
          empty={applications.length === 0
            ? <Empty message="You haven't applied to any jobs yet." />
            : null}>
          {applications.map((app, i) => (
            <Tr key={app.id ?? i} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{app.job?.title ?? app.jobtitle ?? "—"}</Td>
              <Td>{app.job?.company?.name ?? app.companyname ?? "—"}</Td>
              <Td className="text-gray-500">
                {app.applicationDate
                  ? new Date(app.applicationDate).toLocaleDateString()
                  : app.applicationdate ?? "—"}
              </Td>
              <Td><Badge status={app.status} /></Td>
              <Td className="text-xs text-gray-500">
                {app.interviewDate
                  ? `${new Date(app.interviewDate).toLocaleDateString()} — ${app.interviewLocation ?? ""}`
                  : "—"}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default UserDashboard;
