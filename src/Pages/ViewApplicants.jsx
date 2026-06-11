import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Donut from "./ViewReport";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { Page, PageTitle, Card, Badge, Btn, Field, inputCls, Empty } from "../Components/ui";
import { FaSort, FaSortUp, FaSortDown, FaFilePdf, FaSync } from "react-icons/fa";

const ViewApplicants = () => {
  const [applicants,        setApplicants]        = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [sortCriterion,     setSortCriterion]     = useState("");
  const [sortAscending,     setSortAscending]     = useState(true);
  const [refreshKey,        setRefreshKey]        = useState(0);
  // Per-applicant interview state to avoid shared state bug
  const [interviewData,     setInterviewData]     = useState({});

  const jobId  = Cookies.get("jobId");
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

  const accept    = (a) => patchStatus(a, { status: "Under Consideration" });
  const reject    = (a) => patchStatus(a, { status: "Rejected" });
  const schedule  = (a) => {
    const { interviewDate = "", interviewLocation = "" } = interviewData[a.id] ?? {};
    if (!interviewDate || !interviewLocation) return;
    patchStatus(a, { status: "Interview Scheduled", interviewDate, interviewLocation });
  };

  const handleSortChange = (c) => {
    if (sortCriterion === c) setSortAscending((v) => !v);
    else { setSortCriterion(c); setSortAscending(true); }
  };

  const sorted = [...applicants].sort((a, b) => {
    const m = sortAscending ? 1 : -1;
    switch (sortCriterion) {
      case "name":            return m * a.fullname.localeCompare(b.fullname);
      case "applicationDate": return m * (new Date(a.applicationdate) - new Date(b.applicationdate));
      case "status":          return m * a.status.localeCompare(b.status);
      case "education":       return m * a.degree.localeCompare(b.degree);
      case "experience":      return m * (Number(a.experience) - Number(b.experience));
      default:                return 0;
    }
  });

  const SortBtn = ({ val, label }) => (
    <button onClick={() => handleSortChange(val)}
      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800 transition">
      {label}
      {sortCriterion === val
        ? (sortAscending ? <FaSortUp size={10} /> : <FaSortDown size={10} />)
        : <FaSort size={10} className="opacity-40" />}
    </button>
  );

  if (loading) return <div className="py-20"><Spinner loading /></div>;
  if (myRole !== "hr" && myRole !== "company_admin") return <UnauthorizedAccess />;

  return (
    <Page className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <PageTitle>Applicants</PageTitle>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort:</span>
            {[
              { val: "name",            label: "Name" },
              { val: "applicationDate", label: "Date" },
              { val: "education",       label: "Education" },
              { val: "experience",      label: "Experience" },
              { val: "status",          label: "Status" },
            ].map((s) => <SortBtn key={s.val} {...s} />)}
          </div>
          <button onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition">
            <FaSync size={12} /> Refresh
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <Card><Empty message="No applicants yet for this job." /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          {sorted.map((applicant) => {
            const idata = interviewData[applicant.id] ?? {};
            return (
              <Card key={applicant.id} className="flex flex-col gap-3">
                {/* Name + status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{applicant.fullname}</p>
                    <p className="text-xs text-gray-500">{applicant.contactemail}</p>
                  </div>
                  <Badge status={applicant.status} />
                </div>

                {/* Details */}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                  <dt className="font-medium text-gray-400">Degree</dt>        <dd>{applicant.degree}</dd>
                  <dt className="font-medium text-gray-400">University</dt>    <dd>{applicant.university}</dd>
                  <dt className="font-medium text-gray-400">Experience</dt>    <dd>{applicant.experience}</dd>
                  <dt className="font-medium text-gray-400">Phone</dt>         <dd>+251 {applicant.userphone}</dd>
                  <dt className="font-medium text-gray-400">Applied on</dt>    <dd>{applicant.applicationdate}</dd>
                </dl>

                {/* CV */}
                {applicant.cv ? (
                  <button onClick={() => window.open(`/api/applicants/cv/${applicant.cv}`, "_blank")}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline w-fit">
                    <FaFilePdf className="text-red-500" /> Download CV
                  </button>
                ) : (
                  <p className="text-xs text-gray-400">No CV uploaded</p>
                )}

                {/* Actions */}
                {applicant.status === "Pending" && (
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <button onClick={() => accept(applicant)} className={Btn.success("flex-1 text-xs py-1.5")}>
                      Accept
                    </button>
                    <button onClick={() => reject(applicant)} className={Btn.danger("flex-1 text-xs py-1.5")}>
                      Reject
                    </button>
                  </div>
                )}

                {/* Interview scheduling */}
                {applicant.status === "Under Consideration" && (
                  <div className="mt-auto pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-semibold text-gray-600">Schedule interview</p>
                    <Field label="Date" htmlFor={`date-${applicant.id}`}>
                      <input id={`date-${applicant.id}`} type="date"
                        value={idata.interviewDate ?? ""}
                        onChange={(e) => updateInterview(applicant.id, "interviewDate", e.target.value)}
                        className={inputCls() + " text-sm py-1.5"} />
                    </Field>
                    <Field label="Location" htmlFor={`loc-${applicant.id}`}>
                      <input id={`loc-${applicant.id}`} type="text" placeholder="Office / Zoom link"
                        value={idata.interviewLocation ?? ""}
                        onChange={(e) => updateInterview(applicant.id, "interviewLocation", e.target.value)}
                        className={inputCls() + " text-sm py-1.5"} />
                    </Field>
                    <button onClick={() => schedule(applicant)}
                      disabled={!idata.interviewDate || !idata.interviewLocation}
                      className={Btn.primary("w-full text-xs py-1.5 disabled:opacity-40")}>
                      Confirm Interview
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary chart */}
      <Card>
        <h2 className="text-base font-semibold text-gray-700 mb-4">Application Summary</h2>
        <Donut key={refreshKey} />
      </Card>
    </Page>
  );
};

export default ViewApplicants;
