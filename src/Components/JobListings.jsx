import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import JobListing from "./JobListing";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostJobLink from "./PostJobLink";
import { normalizeJobs, isJobOpen, isJobDraft, getJobPostedDate } from "../utils/jobs";
import { SearchIcon, PlusIcon } from "./icons";

const JobListings = ({ isHome = false }) => {
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [sortOrder,    setSortOrder]    = useState("desc");
  const [sortCriteria, setSortCriteria] = useState("postedDate");

  const { user: authUser } = useAuth();
  const role      = authUser?.role;
  const companyId = authUser?.companyId;

  useEffect(() => {
    const url = companyId ? `/api/jobs?companyId=${companyId}` : "/api/jobs";
    axios.get(url)
      .then((r) => setJobs(normalizeJobs(r.data)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return <div className="py-24"><Spinner loading /></div>;
  if (error)   return <p className="text-center py-24 text-red-500 text-sm">Failed to load jobs.</p>;

  const hideClosedJobs = !authUser || role === "user";
  const visibleJobs = (hideClosedJobs ? jobs.filter(isJobOpen) : jobs)
    .filter((job) => role === "company_admin" || !isJobDraft(job));

  const filtered = visibleJobs.filter((job) =>
    [job.title, job.requirement, job.companyName, job.description]
      .some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    switch (sortCriteria) {
      case "postedDate":
        return dir * (new Date(getJobPostedDate(a) ?? 0) - new Date(getJobPostedDate(b) ?? 0));
      case "deadline":    return dir * (new Date(a.deadline) - new Date(b.deadline));
      case "type":        return dir * a.type.localeCompare(b.type);
      case "title":       return dir * a.title.localeCompare(b.title);
      case "companyName": return dir * a.companyName.localeCompare(b.companyName);
      default:            return 0;
    }
  });

  const display = isHome ? sorted.slice(0, 3) : sorted;

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            {isHome && <span className="section-eyebrow mb-3">Open positions</span>}
            <h2 className={`font-bold text-slate-900 tracking-tight ${isHome ? "text-2xl sm:text-3xl mt-3" : "text-xl"}`}>
              {isHome ? "Recent Listings" : "Browse Jobs"}
            </h2>
            {!isHome && (
              <p className="text-sm text-slate-500 mt-1">
                {display.length} {display.length === 1 ? "position" : "positions"} available
              </p>
            )}
            {isHome && (
              <p className="text-sm text-slate-500 mt-1.5 max-w-lg">
                Discover the latest opportunities from companies on the platform.
              </p>
            )}
          </div>

          {/* Post job button for company admin */}
          {!isHome && role === "company_admin" && (
            <PostJobLink className="btn-primary px-4 py-2.5">
              <PlusIcon size={11} /> Post a Job
            </PostJobLink>
          )}
        </div>

        {/* Search & Sort controls */}
        {!isHome && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input
                type="text"
                placeholder="Search by title, company, or skills…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                  text-gray-900 placeholder:text-gray-400 shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                  hover:border-gray-300 transition-all"
              />
            </div>

            {/* Sort controls */}
            <div className="flex gap-2">
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                  hover:border-gray-300 transition-all appearance-none"
              >
                <option value="postedDate">Posted Date</option>
                <option value="title">Title</option>
                <option value="companyName">Company</option>
                <option value="deadline">Deadline</option>
                <option value="type">Type</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                  hover:border-gray-300 transition-all"
              >
                <option value="asc">↑ Asc</option>
                <option value="desc">↓ Desc</option>
              </select>
            </div>
          </div>
        )}

        {/* Grid */}
        {display.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {display.map((job) => <JobListing key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-sm text-gray-500 font-medium">
              {hideClosedJobs && display.length === 0 && !searchTerm
                ? "No open positions right now."
                : "No jobs match your search."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
