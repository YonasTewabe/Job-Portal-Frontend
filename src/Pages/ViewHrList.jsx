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
          axios.get("/api/jobs"),
        ]);
        const hrs  = Array.isArray(profilesRes.data) ? profilesRes.data : [];
        const jobs = Array.isArray(jobsRes.data)     ? jobsRes.data     : [];

        const enriched = hrs.map((p) => ({
          ...p,
          displayName: p.companyName ?? p.companyname ?? p.name ?? p.email,
          jobsPosted:  jobs.filter((j) =>
            (j.companyName ?? j.companyname) === (p.companyName ?? p.companyname)
          ).length,
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

  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (myRole !== "admin") return <UnauthorizedAccess />;

  const headers = [
    { label: "Company",     key: "company" },
    { label: "Email",       key: "email" },
    { label: "Jobs Posted", key: "jobs" },
    { label: "Status",      key: "status" },
    { label: "Action",      key: "action" },
  ];

  return (
    <Page>
      <div className="mb-8">
        <PageTitle>Registered HR</PageTitle>
        <p className="text-sm text-gray-500 mt-1">{profiles.length} account{profiles.length !== 1 ? "s" : ""}</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={profiles.length === 0 ? <Empty message="No HR accounts found." icon="👔" /> : null}
        >
          {profiles.map((p, i) => (
            <Tr key={p.id} striped={i % 2 !== 0}>
              <Td className="font-semibold text-gray-900">{p.displayName}</Td>
              <Td className="text-gray-500">{p.email}</Td>
              <Td className="text-center">
                <span className="text-sm font-semibold text-gray-700">{p.jobsPosted}</span>
              </Td>
              <Td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
                  ${p.hrStatus === "true"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"}`}>
                  {p.hrStatus === "true" ? "Active" : "Suspended"}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => toggleStatus(p.id, p.hrStatus)}
                  className={p.hrStatus === "true"
                    ? Btn.warning("text-xs py-1.5 px-3")
                    : Btn.success("text-xs py-1.5 px-3")}
                >
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
