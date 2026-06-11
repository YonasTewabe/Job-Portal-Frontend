import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { Page, PageTitle, Card, Badge, Table, Tr, Td, Empty } from "../Components/ui";

const ViewStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;
  const userId = authUser?.userId;

  useEffect(() => {
    axios.get(`/api/applications?applicantId=${userId}`)
      .then((r) => setApplications(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (myRole !== "user") return <UnauthorizedAccess />;

  const headers = [
    { label: "Company",    key: "company" },
    { label: "Job Title",  key: "title" },
    { label: "Applied On", key: "date" },
    { label: "Status",     key: "status" },
  ];

  return (
    <Page>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <PageTitle>My Applications</PageTitle>
          <p className="text-sm text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""}</p>
        </div>
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
              <Td className="font-medium text-gray-700">{app.companyname}</Td>
              <Td className="font-semibold text-gray-900">{app.jobtitle}</Td>
              <Td className="text-gray-400 text-xs">{app.applicationdate}</Td>
              <Td>
                <Badge status={app.status} />
                {app.interviewDate && (
                  <p className="text-xs text-gray-400 mt-1">{app.interviewDate}</p>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default ViewStatus;
