import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn } from "../Components/ui";
import { FaSort, FaSortUp, FaSortDown, FaFilePdf, FaComments } from "react-icons/fa";

const COLS = [
  { key: "fullname", label: "Name" },
  { key: "email",    label: "Email" },
  { key: "phone",    label: "Phone" },
  { key: "cv",       label: "CV", sortable: false },
  { key: "message",  label: "Message", sortable: false },
];

const ViewUserList = () => {
  const [profiles,  setProfiles]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [sortKey,   setSortKey]   = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    axios.get("/api/applicants")
      .then((r) => setProfiles(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    if (key === sortKey) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const sortValue = (profile, key) => {
    if (key === "phone") return String(profile.phone ?? profile.userPhone ?? "");
    if (key === "cv") return String(profile.cv ?? "");
    return String(profile[key] ?? "");
  };

  const sorted = [...profiles].sort((a, b) => {
    if (!sortKey) return 0;
    const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey));
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }) => {
    if (col !== sortKey) return <FaSort className="ml-1 inline opacity-25" size={9} />;
    return sortOrder === "asc"
      ? <FaSortUp className="ml-1 inline text-brand-500" size={9} />
      : <FaSortDown className="ml-1 inline text-brand-500" size={9} />;
  };

  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (myRole !== "superadmin") return <NotFoundPage />;

  const headers = COLS.map((c) => ({
    key:     c.key,
    label:   c.sortable === false
      ? c.label
      : <span className="inline-flex items-center">{c.label}<SortIcon col={c.key} /></span>,
    onClick: c.sortable === false ? undefined : () => handleSort(c.key),
  }));

  return (
    <Page>
      <div className="mb-8">
        <PageTitle>Registered Users</PageTitle>
        <p className="text-sm text-gray-500 mt-1">{sorted.length} user{sorted.length !== 1 ? "s" : ""}</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={sorted.length === 0 ? <Empty message="No registered users." icon="👥" /> : null}
        >
          {sorted.map((p, i) => (
            <Tr key={p.id ?? i} striped={i % 2 !== 0}>
              <Td className="font-semibold text-gray-900 whitespace-nowrap">{p.fullname || "—"}</Td>
              <Td className="text-gray-500 text-xs">{p.email || "—"}</Td>
              <Td className="text-gray-500 text-xs whitespace-nowrap">
                {p.phone || p.userPhone ? `+251 ${p.phone || p.userPhone}` : "—"}
              </Td>
              <Td>
                {p.cv ? (
                  <button
                    type="button"
                    onClick={() => window.open(`/api/applicants/cv/${p.cv}`, "_blank")}
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <FaFilePdf className="text-red-500" size={12} /> PDF
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </Td>
              <Td>
                {p.user?.id ? (
                  <Link
                    to={`/messages?userId=${p.user.id}`}
                    className={Btn.ghost("gap-1.5 text-xs py-1.5 px-3")}
                  >
                    <FaComments size={12} /> Message
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default ViewUserList;
