import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { Page, PageTitle, Card, Table, Tr, Td, Empty, Btn, SectionTitle, InfoRow } from "../Components/ui";
import {
  SortIcon as SortNeutralIcon,
  SortUpIcon,
  SortDownIcon,
  MessageIcon,
  UsersIcon,
  CloseIcon,
} from "../Components/icons";
import CvFileActions from "../Components/CvFileActions";

const COLS = [
  { key: "fullname",     label: "Name" },
  { key: "email",        label: "Email" },
  { key: "phone",        label: "Phone" },
  { key: "profileCount", label: "Profiles", sortable: false },
  { key: "message",      label: "Message",  sortable: false },
];

const formatDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

const formatDateRange = (start, end) => {
  if (!start) return "";
  return ` (${start}${end ? ` – ${end}` : " – Present"})`;
};

// ─── Profile detail panel (one profile's data) ───────────────────────────────
const ProfileDetail = ({ profile, userId }) => (
  <div className="space-y-6">
    <div>
      <SectionTitle>Contact</SectionTitle>
      <InfoRow label="Email" value={profile.email || "—"} />
      <InfoRow
        label="Phone"
        value={profile.phone || profile.userPhone
          ? `+251 ${profile.phone || profile.userPhone}`
          : "—"}
      />
    </div>

    <div>
      <SectionTitle>Personal</SectionTitle>
      <InfoRow label="Date of birth" value={formatDate(profile.dateOfBirth)} />
      <InfoRow label="Age" value={profile.age ?? "—"} />
      <InfoRow label="Sex" value={profile.sex || "—"} />
    </div>

    <div>
      <SectionTitle>Education</SectionTitle>
      {profile.educations?.length > 0
        ? profile.educations.map((edu, i) => (
            <InfoRow
              key={i}
              label={profile.educations.length > 1 ? `Education ${i + 1}` : "Education"}
              value={`${edu.degree} — ${edu.university}${formatDateRange(edu.startDate, edu.endDate)}`}
            />
          ))
        : <InfoRow label="Education" value="—" />}
    </div>

    <div>
      <SectionTitle>Work experience</SectionTitle>
      {profile.experiences?.length > 0
        ? profile.experiences.map((exp, i) => (
            <InfoRow
              key={i}
              label={profile.experiences.length > 1 ? `Role ${i + 1}` : "Role"}
              value={`${exp.title} at ${exp.company}${formatDateRange(exp.startDate, exp.endDate)}`}
            />
          ))
        : <InfoRow label="Experience" value="—" />}
    </div>

    <div>
      <SectionTitle>CV</SectionTitle>
      {profile.cv
        ? <CvFileActions filename={profile.cv} />
        : <p className="text-sm text-gray-400">No CV uploaded</p>}
    </div>

    <div className="pt-2 border-t border-gray-100">
      <SectionTitle>Communication</SectionTitle>
      {userId ? (
        <Link
          to={`/messages?userId=${userId}`}
          className={Btn.secondary("gap-2 text-sm inline-flex")}
        >
          <MessageIcon size={14} /> Message job seeker
        </Link>
      ) : (
        <p className="text-sm text-gray-400">No user account linked</p>
      )}
    </div>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const JobSeekerDetailModal = ({ user, profiles, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!user || !profiles?.length) return null;

  const active = profiles[activeIdx];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="shadow-float overflow-hidden flex flex-col max-h-[90vh] p-0">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{user.name || "—"}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email || "—"}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            >
              <CloseIcon size={14} />
            </button>
          </div>

          {/* Profile tabs — only shown when multiple profiles */}
          {profiles.length > 1 && (
            <div className="flex gap-1 px-6 pt-4 pb-0 shrink-0 border-b border-gray-100 overflow-x-auto">
              {profiles.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`px-3 py-2 text-xs font-semibold rounded-t-lg whitespace-nowrap transition-colors
                    ${activeIdx === i
                      ? "bg-white border border-b-white border-gray-200 text-brand-600 -mb-px relative z-10"
                      : "text-gray-400 hover:text-gray-600"}`}
                >
                  {p.profileName || `Profile ${i + 1}`}
                  {p.profileCompleted && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Complete" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Body — scrollable */}
          <div className="overflow-y-auto px-6 py-5 flex-1">
            <ProfileDetail profile={active} userId={user.id} />
          </div>

        </Card>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const ViewUserList = () => {
  const [users,    setUsers]    = useState([]); // one entry per unique user
  const [loading,  setLoading]  = useState(true);
  const [sortKey,  setSortKey]  = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selected, setSelected] = useState(null); // { user, profiles[] }
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    axios.get("/api/applicants")
      .then((r) => {
        const all = Array.isArray(r.data) ? r.data : [];

        // Group all profiles by user id
        const byUser = new Map();
        for (const profile of all) {
          const uid = profile.user?.id ?? profile.id;
          if (!byUser.has(uid)) {
            byUser.set(uid, {
              id:    uid,
              name:  profile.fullname ?? profile.user?.name ?? "",
              email: profile.email    ?? profile.user?.email ?? "",
              phone: profile.phone    ?? profile.userPhone   ?? "",
              profiles: [profile],
            });
          } else {
            byUser.get(uid).profiles.push(profile);
          }
        }

        setUsers([...byUser.values()]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDetail = (userRow) => setSelected(userRow);

  const handleSort = (key) => {
    if (key === sortKey) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const sortValue = (u, key) => {
    if (key === "phone") return String(u.phone ?? "");
    if (key === "profileCount") return String(u.profiles.length);
    return String(u[key] ?? "");
  };

  const sorted = [...users].sort((a, b) => {
    if (!sortKey) return 0;
    const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey));
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const SortIndicator = ({ col }) => {
    if (col !== sortKey) return <SortNeutralIcon className="ml-1 inline opacity-25" size={9} />;
    return sortOrder === "asc"
      ? <SortUpIcon className="ml-1 inline text-brand-500" size={9} />
      : <SortDownIcon className="ml-1 inline text-brand-500" size={9} />;
  };

  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (myRole !== "superadmin") return <NotFoundPage />;

  const headers = COLS.map((c) => ({
    key:     c.key,
    label:   c.sortable === false
      ? c.label
      : <span className="inline-flex items-center">{c.label}<SortIndicator col={c.key} /></span>,
    onClick: c.sortable === false ? undefined : () => handleSort(c.key),
  }));

  return (
    <Page>
      <div className="mb-8">
        <PageTitle>Registered Users</PageTitle>
        <p className="text-sm text-gray-500 mt-1">
          {sorted.length} user{sorted.length !== 1 ? "s" : ""} · Click a row to view details
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table
          headers={headers}
          empty={sorted.length === 0 ? <Empty message="No registered users." icon={UsersIcon} /> : null}
        >
          {sorted.map((u, i) => (
            <Tr key={u.id ?? i} striped={i % 2 !== 0} onClick={() => openDetail(u)}>
              <Td className="font-semibold text-gray-900 whitespace-nowrap">{u.name || "—"}</Td>
              <Td className="text-gray-500 text-xs">{u.email || "—"}</Td>
              <Td className="text-gray-500 text-xs whitespace-nowrap">
                {u.phone ? `+251 ${u.phone}` : "—"}
              </Td>
              <Td>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700">
                  {u.profiles.length}
                  {u.profiles.length > 1 && (
                    <span className="text-xs font-normal text-gray-400">profiles</span>
                  )}
                </span>
              </Td>
              <Td>
                <Link
                  to={`/messages?userId=${u.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={Btn.ghost("gap-1.5 text-xs py-1.5 px-3")}
                >
                  <MessageIcon size={12} /> Message
                </Link>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {selected && (
        <JobSeekerDetailModal
          user={selected}
          profiles={selected.profiles}
          onClose={() => setSelected(null)}
        />
      )}
    </Page>
  );
};

export default ViewUserList;
