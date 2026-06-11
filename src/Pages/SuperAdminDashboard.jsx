import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { toast } from "react-toastify";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn, Badge } from "../Components/ui";
import { FaPlus } from "react-icons/fa";

const SuperAdminDashboard = () => {
  const { user: authUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (authUser?.role !== "superadmin") return;
    axios.get("/api/companies")
      .then((r) => setCompanies(Array.isArray(r.data) ? r.data : []))
      .catch(() => toast.error("Failed to load companies"))
      .finally(() => setLoading(false));
  }, [authUser]);

  const toggleStatus = async (company) => {
    try {
      const { data } = await axios.patch(`/api/companies/${company.id}`, {
        isActive: !company.isActive,
      });
      setCompanies((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    } catch { toast.error("Failed to update company status"); }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company and all its data? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      toast.success("Company deleted");
    } catch { toast.error("Failed to delete company"); }
  };

  if (authUser?.role !== "superadmin") return <UnauthorizedAccess />;
  if (loading) return <div className="py-20"><Spinner loading /></div>;

  const headers = [
    { label: "Company",  key: "name" },
    { label: "Admin",    key: "admin" },
    { label: "Email",    key: "email" },
    { label: "Jobs",     key: "jobs" },
    { label: "Status",   key: "status" },
    { label: "Actions",  key: "actions" },
  ];

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageTitle>Companies</PageTitle>
        <Link to="/superadmin/companies/new" className={Btn.primary("gap-2")}>
          <FaPlus size={12} /> New Company
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={companies.length === 0
            ? <Empty message="No companies yet. Add one to get started." />
            : null}
        >
          {companies.map((company, i) => (
            <Tr key={company.id} striped={i % 2 !== 0}>
              <Td className="font-semibold text-gray-900">{company.name}</Td>
              <Td>{company.admin?.name ?? "—"}</Td>
              <Td className="text-gray-500">{company.contactEmail}</Td>
              <Td className="text-center">{company.jobs?.length ?? 0}</Td>
              <Td>
                <Badge status={company.isActive ? "Active" : "Suspended"} />
              </Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(company)}
                    className={company.isActive
                      ? Btn.danger("text-xs py-1 px-2.5")
                      : Btn.success("text-xs py-1 px-2.5")}>
                    {company.isActive ? "Suspend" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className={Btn.danger("text-xs py-1 px-2.5")}>
                    Delete
                  </button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default SuperAdminDashboard;
