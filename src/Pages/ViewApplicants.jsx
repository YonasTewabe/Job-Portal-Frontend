import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Donut from "./ViewReport";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { Page, PageTitle, Card, Badge, Btn, inputCls, Empty, Table, Tr, Td, Field, SectionTitle, InfoRow } from "../Components/ui";
import { FaSortUp, FaSortDown, FaFilePdf, FaSync, FaTimes } from "react-icons/fa";
import { calculateAge } from "../utils/profileSchema";

const formatDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
};

const formatDateRange = (start, end) => {
  if (!start) return "";
  return ` (${start}${end ? ` – ${end}` : " – Present"})`;
};

const ApplicantActions = ({
  applicant,
  getInterviewFields,
  updateInterview,
  accept,
  reject,
  schedule,
  onReschedule,
  rescheduleMode,
  onRescheduleSave,
  onRescheduleCancel,
}) => {
  if (applicant.status === "Pending") {
    return (
      <div className="flex gap-2">
        <button type="button" onClick={() => accept(applicant)} className={Btn.success("text-sm py-2 px-4")}>
          Accept
        </button>
        <button type="button" onClick={() => reject(applicant)} className={Btn.danger("text-sm py-2 px-4")}>
          Reject
        </button>
      </div>
    );
  }

  if (applicant.status === "Under Consideration") {
    const fields = getInterviewFields(applicant);
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Interview date" htmlFor="modal-interview-date">
            <input
              id="modal-interview-date"
              type="date"
              value={fields.interviewDate}
              onChange={(e) => updateInterview(applicant.id, "interviewDate", e.target.value)}
              className={inputCls()}
            />
          </Field>
          <Field label="Interview time" htmlFor="modal-interview-time">
            <input
              id="modal-interview-time"
              type="time"
              value={fields.interviewTime}
              onChange={(e) => updateInterview(applicant.id, "interviewTime", e.target.value)}
              className={inputCls()}
            />
          </Field>
        </div>
        <Field label="Location" htmlFor="modal-interview-location">
          <input
            id="modal-interview-location"
            type="text"
            placeholder="Office or Zoom link"
            value={fields.interviewLocation}
            onChange={(e) => updateInterview(applicant.id, "interviewLocation", e.target.value)}
            className={inputCls()}
          />
        </Field>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => schedule(applicant)}
            disabled={!fields.interviewDate || !fields.interviewTime || !fields.interviewLocation}
            className={Btn.primary("flex-1 text-sm py-2 disabled:opacity-40")}
          >
            Schedule interview
          </button>
          <button type="button" onClick={() => reject(applicant)} className={Btn.danger("text-sm py-2 px-4")}>
            Reject
          </button>
        </div>
      </div>
    );
  }

  if (applicant.status === "Interview Scheduled") {
    if (rescheduleMode) {
      const fields = getInterviewFields(applicant);
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" htmlFor="reschedule-date">
              <input
                id="reschedule-date"
                type="date"
                value={fields.interviewDate}
                onChange={(e) => updateInterview(applicant.id, "interviewDate", e.target.value)}
                className={inputCls()}
              />
            </Field>
            <Field label="Time" htmlFor="reschedule-time">
              <input
                id="reschedule-time"
                type="time"
                value={fields.interviewTime}
                onChange={(e) => updateInterview(applicant.id, "interviewTime", e.target.value)}
                className={inputCls()}
              />
            </Field>
          </div>
          <Field label="Location" htmlFor="reschedule-location">
            <input
              id="reschedule-location"
              type="text"
              placeholder="Office or Zoom link"
              value={fields.interviewLocation}
              onChange={(e) => updateInterview(applicant.id, "interviewLocation", e.target.value)}
              className={inputCls()}
            />
          </Field>
          <div className="flex gap-2">
            <button type="button" onClick={onRescheduleCancel} className={Btn.secondary("flex-1 text-sm py-2")}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onRescheduleSave(applicant)}
              disabled={!fields.interviewDate || !fields.interviewTime || !fields.interviewLocation}
              className={Btn.primary("flex-1 text-sm py-2 disabled:opacity-40")}
            >
              Save changes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onReschedule(applicant)} className={Btn.primary("text-sm py-2 px-4")}>
          Reschedule
        </button>
        <button type="button" onClick={() => reject(applicant)} className={Btn.danger("text-sm py-2 px-4")}>
          Reject
        </button>
      </div>
    );
  }

  return null;
};

const ApplicantDetailModal = ({
  applicant,
  profile,
  canManage,
  onClose,
  formatAppliedDate,
  formatInterviewWhen,
  getInterviewFields,
  updateInterview,
  accept,
  reject,
  schedule,
  reschedule,
  getApplicantCv,
}) => {
  const [rescheduleMode, setRescheduleMode] = useState(false);

  const openReschedule = (app) => {
    const parts = parseInterviewParts(app.interviewDate);
    updateInterview(app.id, "interviewDate", parts.date);
    updateInterview(app.id, "interviewTime", parts.time);
    updateInterview(app.id, "interviewLocation", app.interviewLocation ?? "");
    setRescheduleMode(true);
  };

  const handleRescheduleSave = async (app) => {
    await reschedule(app);
    setRescheduleMode(false);
  };

  const age = profile.age ?? calculateAge(profile.dateOfBirth);
  const cv = getApplicantCv(applicant);

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
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 truncate">{profile.fullname}</h2>
                <Badge status={applicant.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">Applied {formatAppliedDate(applicant)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
            <div>
              <SectionTitle>Contact</SectionTitle>
              <InfoRow label="Email" value={profile.email} />
              <InfoRow
                label="Phone"
                value={profile.userPhone ? `+251 ${profile.userPhone}` : "—"}
              />
            </div>

            <div>
              <SectionTitle>Personal</SectionTitle>
              <InfoRow label="Date of birth" value={formatDate(profile.dateOfBirth)} />
              <InfoRow label="Age" value={age ?? "—"} />
              <InfoRow label="Sex" value={profile.sex || "—"} />
            </div>

            <div>
              <SectionTitle>Education</SectionTitle>
              {(profile.educations?.length ? profile.educations : []).map((edu, i) => (
                <InfoRow
                  key={i}
                  label={profile.educations.length > 1 ? `Education ${i + 1}` : "Education"}
                  value={`${edu.degree} — ${edu.university}${formatDateRange(edu.startDate, edu.endDate)}`}
                />
              ))}
              {(!profile.educations || profile.educations.length === 0) && (
                <InfoRow label="Education" value="—" />
              )}
            </div>

            <div>
              <SectionTitle>Work experience</SectionTitle>
              {(profile.experiences?.length ? profile.experiences : []).map((exp, i) => (
                <InfoRow
                  key={i}
                  label={profile.experiences.length > 1 ? `Role ${i + 1}` : "Role"}
                  value={`${exp.title} at ${exp.company}${formatDateRange(exp.startDate, exp.endDate)}`}
                />
              ))}
              {(!profile.experiences || profile.experiences.length === 0) && (
                <InfoRow label="Experience" value="—" />
              )}
            </div>

            <div>
              <SectionTitle>CV</SectionTitle>
              {cv ? (
                <button
                  type="button"
                  onClick={() => window.open(`/api/applicants/cv/${cv}`, "_blank")}
                  className={Btn.secondary("gap-2 text-sm")}
                >
                  <FaFilePdf className="text-red-500" size={14} /> View CV
                </button>
              ) : (
                <p className="text-sm text-gray-400">No CV uploaded</p>
              )}
            </div>

            {applicant.status === "Interview Scheduled" && !rescheduleMode && (
              <div>
                <SectionTitle>Interview</SectionTitle>
                <InfoRow label="When" value={formatInterviewWhen(applicant.interviewDate)} />
                <InfoRow label="Where" value={applicant.interviewLocation ?? "—"} />
              </div>
            )}

            {canManage && (
              <div className="pt-2 border-t border-gray-100">
                <SectionTitle>Actions</SectionTitle>
                <ApplicantActions
                  applicant={applicant}
                  getInterviewFields={getInterviewFields}
                  updateInterview={updateInterview}
                  accept={accept}
                  reject={reject}
                  schedule={schedule}
                  onReschedule={openReschedule}
                  rescheduleMode={rescheduleMode}
                  onRescheduleSave={handleRescheduleSave}
                  onRescheduleCancel={() => setRescheduleMode(false)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const parseInterviewParts = (iso) => {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

const ViewApplicants = () => {
  const [applicants,    setApplicants]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [sortCriterion, setSortCriterion] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [refreshKey,    setRefreshKey]    = useState(0);
  const [interviewData, setInterviewData]     = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const { id: jobId } = useParams();
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/applications?jobId=${jobId}`)
      .then((r) => setApplicants(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId, refreshKey]);

  const updateInterview = (id, field, value) =>
    setInterviewData((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: value } }));

  const patchStatus = async (applicant, patch) => {
    try {
      await axios.patch(`/api/applications/${applicant.id}`, patch);
      const updated = { ...applicant, ...patch };
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicant.id ? updated : a))
      );
      setSelectedApplicant((prev) => (prev?.id === applicant.id ? updated : prev));
    } catch (e) { console.error(e); }
  };

  const accept   = (a) => patchStatus(a, { status: "Under Consideration" });
  const reject   = (a) => patchStatus(a, { status: "Rejected" });

  const getInterviewFields = (applicant) => {
    const idata = interviewData[applicant.id] ?? {};
    const parts = parseInterviewParts(applicant.interviewDate);
    return {
      interviewDate: idata.interviewDate ?? parts.date,
      interviewTime: idata.interviewTime ?? parts.time,
      interviewLocation: idata.interviewLocation ?? applicant.interviewLocation ?? "",
    };
  };

  const schedule = (a) => {
    const { interviewDate, interviewTime, interviewLocation } = getInterviewFields(a);
    if (!interviewDate || !interviewTime || !interviewLocation) return;
    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`).toISOString();
    patchStatus(a, { status: "Interview Scheduled", interviewDate: interviewDateTime, interviewLocation });
  };

  const reschedule = async (a) => {
    const { interviewDate, interviewTime, interviewLocation } = getInterviewFields(a);
    if (!interviewDate || !interviewTime || !interviewLocation) return;
    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`).toISOString();
    await patchStatus(a, { interviewDate: interviewDateTime, interviewLocation });
  };

  const getApplicantProfile = (app) => {
    const p = app.applicant ?? app;
    const user = p.user ?? {};
    return {
      ...p,
      fullname: p.fullname ?? p.fullName ?? user.name ?? "—",
      email: p.contactemail ?? p.contactEmail ?? p.email ?? user.email ?? "—",
      userPhone: p.userPhone ?? p.userphone ?? p.phone ?? "",
      dateOfBirth: p.dateOfBirth,
      age: p.age,
      sex: p.sex,
      educations: p.educations ?? [],
      experiences: p.experiences ?? [],
    };
  };

  const getApplicantName = (app) => getApplicantProfile(app).fullname;

  const getApplicantEmail = (app) => getApplicantProfile(app).email;

  const getApplicantPhone = (app) => getApplicantProfile(app).userPhone;

  const getApplicantCv = (app) => {
    const p = app.applicant ?? app;
    return p.cv ?? app.cv;
  };

  const getAppliedDate = (app) => app.applicationDate ?? app.applicationdate;

  const formatAppliedDate = (app) => formatDate(getAppliedDate(app));

  const formatInterviewWhen = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const handleSortChange = (c) => {
    if (sortCriterion === c) setSortAscending((v) => !v);
    else { setSortCriterion(c); setSortAscending(true); }
  };

  const sorted = [...applicants].sort((a, b) => {
    const m = sortAscending ? 1 : -1;
    switch (sortCriterion) {
      case "name":            return m * getApplicantName(a).localeCompare(getApplicantName(b));
      case "applicationDate": return m * (new Date(getAppliedDate(a) || 0) - new Date(getAppliedDate(b) || 0));
      case "status":          return m * a.status.localeCompare(b.status);
      default:                return 0;
    }
  });

  const canManage = myRole === "hr" || myRole === "company_admin";
  const canView   = canManage || myRole === "superadmin";

  const sortIcon = (key) => {
    if (sortCriterion !== key) return null;
    return sortAscending
      ? <FaSortUp size={9} className="inline ml-1 opacity-70" />
      : <FaSortDown size={9} className="inline ml-1 opacity-70" />;
  };

  const headers = [
    { label: "Name",       key: "name",            onClick: () => handleSortChange("name"),            sort: sortIcon("name") },
    { label: "Email",      key: "email" },
    { label: "Phone",      key: "phone" },
    { label: "Applied",    key: "applicationDate", onClick: () => handleSortChange("applicationDate"), sort: sortIcon("applicationDate") },
    { label: "Status",     key: "status",          onClick: () => handleSortChange("status"),          sort: sortIcon("status") },
    { label: "CV",         key: "cv" },
  ];

  if (!jobId) return <NotFoundPage />;
  if (!canView) return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  return (
    <Page className="max-w-7xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>Applicants</PageTitle>
          <p className="text-sm text-gray-500 mt-1">
            {applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}
            {canManage && sorted.length > 0 && " · Click a row to view details"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800
              px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-all font-medium"
          >
            <FaSync size={11} /> Refresh
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden mb-10">
        <Table
          headers={headers}
          empty={sorted.length === 0
            ? <Empty message="No applicants yet for this job." icon="👤" />
            : null}
        >
          {sorted.map((applicant, i) => (
            <Tr
              key={applicant.id}
              striped={i % 2 !== 0}
              onClick={() => setSelectedApplicant(applicant)}
            >
              <Td className="font-medium text-gray-900 whitespace-nowrap">{getApplicantName(applicant)}</Td>
              <Td className="text-xs text-gray-500">{getApplicantEmail(applicant)}</Td>
              <Td className="whitespace-nowrap text-xs">
                {getApplicantPhone(applicant) ? `+251 ${getApplicantPhone(applicant)}` : "—"}
              </Td>
              <Td className="text-xs text-gray-500 whitespace-nowrap">{formatAppliedDate(applicant)}</Td>
              <Td><Badge status={applicant.status} /></Td>
              <Td>
                {getApplicantCv(applicant) ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/api/applicants/cv/${getApplicantCv(applicant)}`, "_blank");
                    }}
                    className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <FaFilePdf className="text-red-500" size={12} /> PDF
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Application Summary</h2>
        <Donut jobId={jobId} key={refreshKey} />
      </Card>

      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          profile={getApplicantProfile(selectedApplicant)}
          canManage={canManage}
          onClose={() => setSelectedApplicant(null)}
          formatAppliedDate={formatAppliedDate}
          formatInterviewWhen={formatInterviewWhen}
          getInterviewFields={getInterviewFields}
          updateInterview={updateInterview}
          accept={accept}
          reject={reject}
          schedule={schedule}
          reschedule={reschedule}
          getApplicantCv={getApplicantCv}
        />
      )}
    </Page>
  );
};

export default ViewApplicants;
