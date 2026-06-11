import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn } from "../Components/ui";

const ViewHrList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    const load = async () => {
      try {
        const [profilesRes, jobsRes] = await Promise.all([
          axios.get("/api/users?role=hr"),
          // Jobs fetched without companyId to count all postings across all HR companies
          axios.get("/api/jobs"),
        ]);
        const hrs  = Array.isArray(profilesRes.data) ? profilesRes.data : [];
        const jobs = Array.isArray(jobsRes.data)     ? jobsRes.data     : [];

        const enriched = hrs.map((p) => ({
          ...p,
          // Handle both old (companyname) and new (companyName) API shapes
          displayName: p.companyName ?? p.companyname ?? p.name ?? p.email,
          jobsPosted:  jobs.filter((j) =>
            (j.companyName ?? j.companyname) === (p.companyName ?? p.companyname)
          ).length,
          // Use status/hrStatus already on the user object; avoid extra fetches
          hrStatus: String(p.hrStatus ?? p.status ?? "false"),
        }));

        setProfiles(enriched);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleStatus = async (id, current) => {
    const next = current === "true" ? "false" : "true";
    try {
      await axios.patch(`/api/users/${id}`, { hrStatus: next });
      setProfiles((prev) => prev.map((p) => p.id === id ? { ...p, hrStatus: next } : p));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="py-20"><Spinner loading /></div>;
  if (myRole !== "admin") return <UnauthorizedAccess />;

  const headers = [
    { label: "Company",      key: "company" },
    { label: "Email",        key: "email" },
    { label: "Jobs Posted",  key: "jobs" },
    { label: "Status",       key: "status" },
    { label: "Action",       key: "action" },
  ];

  return (
    <Page>
      <PageTitle>Registered HR</PageTitle>
      <Card className="p-0 overflow-hidden">
        <Table headers={headers}
          empty={profiles.length === 0 ? <Empty message="No HR accounts found." /> : null}>
          {profiles.map((p, i) => (
            <Tr key={p.id} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{p.displayName}</Td>
              <Td>{p.email}</Td>
              <Td className="text-center">{p.jobsPosted}</Td>
              <Td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                  ${p.hrStatus === "true" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {p.hrStatus === "true" ? "Active" : "Suspended"}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => toggleStatus(p.id, p.hrStatus)}
                  className={p.hrStatus === "true" ? Btn.danger("text-xs py-1.5 px-3") : Btn.success("text-xs py-1.5 px-3")}>
                  {p.hrStatus === "true" ? "Suspend" : "Activate"}
                </button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default ViewHrList;
