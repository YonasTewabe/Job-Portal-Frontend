import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { Page, PageTitle, Card, Table, Tr, Td, Empty } from "../Components/ui";
import { formatEducationSummary, formatExperienceSummary } from "../Components/ProfileEducationExperience";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const COLS = [
  { key: "fullname",   label: "Full Name" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "age",         label: "Age" },
  { key: "sex",        label: "Sex" },
  { key: "educations",  label: "Education" },
  { key: "experiences", label: "Experience" },
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
    if (key === "educations") return formatEducationSummary(profile.educations);
    if (key === "experiences") return formatExperienceSummary(profile.experiences);
    if (key === "dateOfBirth") return profile.dateOfBirth ?? "";
    if (key === "age") return String(profile.age ?? "");
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
    label:   <span className="inline-flex items-center">{c.label}<SortIcon col={c.key} /></span>,
    onClick: () => handleSort(c.key),
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
              <Td className="font-semibold text-gray-900">{p.fullname}</Td>
              <Td className="text-gray-500 text-xs">{p.dateOfBirth || "—"}</Td>
              <Td className="text-gray-500">{p.age ?? "—"}</Td>
              <Td className="text-gray-500">{p.sex}</Td>
              <Td className="text-gray-600 text-xs max-w-xs">{formatEducationSummary(p.educations)}</Td>
              <Td className="text-gray-600 text-xs max-w-xs">{formatExperienceSummary(p.experiences)}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </Page>
  );
};

export default ViewUserList;
