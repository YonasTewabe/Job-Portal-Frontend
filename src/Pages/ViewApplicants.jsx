import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Donut from "./ViewReport";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import NotFoundPage from "./NotFoundPage";
import { Page, PageTitle, Card, Badge, Btn, inputCls, Empty, Table, Tr, Td, Field } from "../Components/ui";
import { FaSortUp, FaSortDown, FaFilePdf, FaSync, FaTimes } from "react-icons/fa";

const ViewApplicants = () => {
  const [applicants,    setApplicants]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [sortCriterion, setSortCriterion] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [refreshKey,    setRefreshKey]    = useState(0);
  const [interviewData, setInterviewData]     = useState({});
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

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
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicant.id ? { ...a, ...patch } : a))
      );
    } catch (e) { console.error(e); }
  };

  const accept   = (a) => patchStatus(a, { status: "Under Consideration" });
  const reject   = (a) => patchStatus(a, { status: "Rejected" });

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

  const openRescheduleModal = (applicant) => {
    const parts = parseInterviewParts(applicant.interviewDate);
    setInterviewData((prev) => ({
      ...prev,
      [applicant.id]: {
        interviewDate: parts.date,
        interviewTime: parts.time,
        interviewLocation: applicant.interviewLocation ?? "",
      },
    }));
    setRescheduleTarget(applicant);
  };

  const closeRescheduleModal = () => setRescheduleTarget(null);

  const reschedule = async (a) => {
    const { interviewDate, interviewTime, interviewLocation } = getInterviewFields(a);
    if (!interviewDate || !interviewTime || !interviewLocation) return;
    const interviewDateTime = new Date(`${interviewDate}T${interviewTime}`).toISOString();
    await patchStatus(a, { interviewDate: interviewDateTime, interviewLocation });
    closeRescheduleModal();
  };

  const getApplicantProfile = (app) => app.applicant ?? app;

  const getApplicantName = (app) => {
    const p = getApplicantProfile(app);
    return p.fullname ?? p.fullName ?? p.name ?? "—";
  };

  const getApplicantEmail = (app) => {
    const p = getApplicantProfile(app);
    return p.contactemail ?? p.contactEmail ?? p.email ?? "—";
  };

  const getApplicantPhone = (app) => {
    const p = getApplicantProfile(app);
    return p.userPhone ?? p.userphone ?? p.contactPhone ?? "";
  };

  const getApplicantCv = (app) => {
    const p = getApplicantProfile(app);
    return p.cv ?? app.cv;
  };

  const getAppliedDate = (app) => app.applicationDate ?? app.applicationdate;

  const formatAppliedDate = (app) => {
    const raw = getAppliedDate(app);
    if (!raw) return "—";
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString();
  };

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
    ...(canManage ? [{ label: "Actions", key: "actions" }] : []),
  ];

  if (!jobId) return <NotFoundPage />;
  if (!canView) return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  return (
    <Page className="max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <PageTitle>Applicants</PageTitle>
          <p className="text-sm text-gray-500 mt-1">{applicants.length} total applicant{applicants.length !== 1 ? "s" : ""}</p>
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
              <Tr key={applicant.id} striped={i % 2 !== 0}>
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
                      onClick={() => window.open(`/api/applicants/cv/${getApplicantCv(applicant)}`, "_blank")}
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      <FaFilePdf className="text-red-500" size={12} /> PDF
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </Td>
                {canManage && (
                  <Td className="min-w-[200px]">
                    {applicant.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => accept(applicant)} className={Btn.success("text-xs py-1.5 px-3")}>
                          Accept
                        </button>
                        <button onClick={() => reject(applicant)} className={Btn.danger("text-xs py-1.5 px-3")}>
                          Reject
                        </button>
                      </div>
                    )}
                    {applicant.status === "Under Consideration" && (() => {
                      const fields = getInterviewFields(applicant);
                      return (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="date"
                              aria-label="Interview date"
                              value={fields.interviewDate}
                              onChange={(e) => updateInterview(applicant.id, "interviewDate", e.target.value)}
                              className={inputCls() + " text-xs py-1.5 flex-1 min-w-0"}
                            />
                            <input
                              type="time"
                              aria-label="Interview time"
                              value={fields.interviewTime}
                              onChange={(e) => updateInterview(applicant.id, "interviewTime", e.target.value)}
                              className={inputCls() + " text-xs py-1.5 w-[7.5rem] shrink-0"}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Location or Zoom link"
                            aria-label="Interview location"
                            value={fields.interviewLocation}
                            onChange={(e) => updateInterview(applicant.id, "interviewLocation", e.target.value)}
                            className={inputCls() + " text-xs py-1.5"}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => schedule(applicant)}
                              disabled={!fields.interviewDate || !fields.interviewTime || !fields.interviewLocation}
                              className={Btn.primary("flex-1 text-xs py-1.5 disabled:opacity-40")}
                            >
                              Schedule
                            </button>
                            <button onClick={() => reject(applicant)} className={Btn.danger("text-xs py-1.5 px-3")}>
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                    {applicant.status === "Interview Scheduled" && (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            <span className="text-gray-400">When:</span>{" "}
                            {formatInterviewWhen(applicant.interviewDate)}
                          </p>
                          <p className="truncate max-w-[200px]" title={applicant.interviewLocation}>
                            <span className="text-gray-400">Where:</span>{" "}
                            {applicant.interviewLocation ?? "—"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openRescheduleModal(applicant)}
                            className={Btn.primary("text-xs py-1.5 px-3")}
                          >
                            Reschedule
                          </button>

                          <button type="button" onClick={() => reject(applicant)} className={Btn.danger("text-xs py-1.5 px-3")}>
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </Td>
                )}
              </Tr>
          ))}
        </Table>
      </Card>

      {/* Summary chart */}
      <Card>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Application Summary</h2>
        <Donut jobId={jobId} key={refreshKey} />
      </Card>

      {rescheduleTarget && (() => {
        const fields = getInterviewFields(rescheduleTarget);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeRescheduleModal}
            role="presentation"
          >
            <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Card className="shadow-float">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Reschedule interview</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{getApplicantName(rescheduleTarget)}</p>
                </div>
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  aria-label="Close"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date" htmlFor="reschedule-date">
                    <input
                      id="reschedule-date"
                      type="date"
                      value={fields.interviewDate}
                      onChange={(e) => updateInterview(rescheduleTarget.id, "interviewDate", e.target.value)}
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="Time" htmlFor="reschedule-time">
                    <input
                      id="reschedule-time"
                      type="time"
                      value={fields.interviewTime}
                      onChange={(e) => updateInterview(rescheduleTarget.id, "interviewTime", e.target.value)}
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
                    onChange={(e) => updateInterview(rescheduleTarget.id, "interviewLocation", e.target.value)}
                    className={inputCls()}
                  />
                </Field>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeRescheduleModal} className={Btn.secondary("flex-1")}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => reschedule(rescheduleTarget)}
                  disabled={!fields.interviewDate || !fields.interviewTime || !fields.interviewLocation}
                  className={Btn.primary("flex-1 disabled:opacity-40")}
                >
                  Save changes
                </button>
              </div>
            </Card>
            </div>
          </div>
        );
      })()}
    </Page>
  );
};

export default ViewApplicants;
