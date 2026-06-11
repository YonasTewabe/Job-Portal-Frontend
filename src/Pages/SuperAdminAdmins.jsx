import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn } from "../Components/ui";

const SuperAdminAdmins = () => {
  const { user: authUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser?.role !== "superadmin") return;

    axios
      .get("/api/users?role=superadmin")
      .then(({ data }) => setAdmins(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load super admins"))
      .finally(() => setLoading(false));
  }, [authUser]);

  if (authUser?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  return (
    <Page className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <PageTitle>Super Admins</PageTitle>
          <p className="text-sm text-gray-500 mt-1">
            Platform administrators with full access.
          </p>
        </div>
        <Link to="/superadmin/admins/new" className={Btn.primary("gap-2 shadow-sm")}>
          + Add Super Admin
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "you", label: "" },
          ]}
          empty={admins.length === 0 && <Empty message="No super admins found." icon="👤" />}
        >
          {admins.map((admin, i) => (
            <Tr key={admin.id} striped={i % 2 !== 0}>
              <Td className="font-medium text-gray-900">{admin.name}</Td>
              <Td>{admin.email}</Td>
              <Td className="text-right">
                {admin.id === authUser.userId && (
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                    You
                  </span>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default SuperAdminAdmins;
