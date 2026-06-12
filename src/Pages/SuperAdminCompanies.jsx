import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { toast } from "../utils/toast";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn, Badge } from "../Components/ui";
import { PlusIcon, BuildingIcon } from "../Components/icons";
import { countOpenJobs } from "../utils/jobs";

const SuperAdminCompanies = () => {
  const { user: authUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);

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

  if (authUser?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const headers = [
    { label: "Company",  key: "name" },
    { label: "Admin",    key: "admin" },
    { label: "Email",    key: "email" },
    { label: "Jobs",     key: "jobs" },
    { label: "View",     key: "view" },
    { label: "Status",   key: "status" },
    { label: "Actions",  key: "actions" },
  ];

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>Companies</PageTitle>
          <p className="text-sm text-gray-500 mt-1">{companies.length} registered</p>
        </div>
        <Link to="/superadmin/companies/new" className={Btn.primary("gap-2 shadow-sm")}>
          <PlusIcon size={11} /> New Company
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={companies.length === 0
            ? <Empty message="No companies yet. Add one to get started." icon={BuildingIcon} />
            : null}
        >
          {companies.map((company, i) => (
            <Tr key={company.id} striped={i % 2 !== 0}>
              <Td>
                <div>
                  <Link
                    to={`/superadmin/companies/${company.id}`}
                    className="font-semibold text-gray-900 hover:text-brand-700 hover:underline"
                  >
                    {company.name}
                  </Link>
                  {company.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{company.description}</p>
                  )}
                </div>
              </Td>
              <Td className="text-gray-600">{company.admin?.name ?? "—"}</Td>
              <Td className="text-gray-400 text-xs">{company.contactEmail}</Td>
              <Td>
                <span className="text-sm font-semibold text-gray-700">
                  {countOpenJobs(company.jobs)} open
                </span>
                <span className="text-xs text-gray-400 ml-1">
                  / {company.jobs?.length ?? 0} total
                </span>
              </Td>
              <Td>
                <Link
                  to={`/superadmin/companies/${company.id}`}
                  className="text-xs link-brand"
                >
                  View jobs →
                </Link>
              </Td>
              <Td>
                <Badge status={company.isActive ? "Active" : "Suspended"} />
              </Td>
              <Td>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(company)}
                    className={company.isActive
                      ? Btn.warning("text-xs py-1.5 px-3")
                      : Btn.success("text-xs py-1.5 px-3")}>
                    {company.isActive ? "Suspend" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteCompany(company.id)}
                    className={Btn.danger("text-xs py-1.5 px-3")}>
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

export default SuperAdminCompanies;
