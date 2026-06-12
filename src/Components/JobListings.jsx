import { useEffect, useMemo, useState } from "react";
import axios from "../axiosInterceptor";
import JobListing from "./JobListing";
import JobFilterPanel from "./JobFilterPanel";
import Spinner from "./Spinner";
import { useAuth } from "../context/AuthContext";
import PostJobLink from "./PostJobLink";
import { normalizeJobs, isJobOpen, isJobDraft, getJobPostedDate } from "../utils/jobs";
import { SearchIcon, PlusIcon } from "./icons";

export const DEFAULT_FILTERS = {
  types: new Set(),
  postedRange: "any",
  hasSalary: null,
};

export const DEFAULT_SORT = { criteria: "postedDate", order: "desc" };

const postedAfter = (range) => {
  if (range === "any") return null;
  const d = new Date();
  if (range === "today") d.setHours(0, 0, 0, 0);
  else if (range === "week") d.setDate(d.getDate() - 7);
  else if (range === "month") d.setDate(d.getDate() - 30);
  return d;
};

export const countActiveFilters = (filters, sort) => {
  let n = 0;
  if (filters.types.size) n += filters.types.size;
  if (filters.postedRange !== "any") n += 1;
  if (filters.hasSalary !== null) n += 1;
  if (sort.criteria !== DEFAULT_SORT.criteria || sort.order !== DEFAULT_SORT.order) n += 1;
  return n;
};

const ActiveChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
    {label}
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
      className="text-brand-400 hover:text-brand-700 transition-colors"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </span>
);

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user: authUser } = useAuth();
  const role = authUser?.role;
  const companyId = authUser?.companyId;

  useEffect(() => {
    const url = companyId ? `/api/jobs?companyId=${companyId}` : "/api/jobs";
    axios
      .get(url)
      .then((r) => setJobs(normalizeJobs(r.data)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleFilters = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const handleSort = (criteria, order) => setSort({ criteria, order });
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
    setSearchTerm("");
  };

  const activeCount = useMemo(() => countActiveFilters(filters, sort), [filters, sort]);

  const display = useMemo(() => {
    if (loading || error) return [];

    const hideClosedJobs = !authUser || role === "user";
    const visible = (hideClosedJobs ? jobs.filter(isJobOpen) : jobs).filter(
      (job) => role === "company_admin" || !isJobDraft(job)
    );

    const searched = visible.filter((job) =>
      [job.title, job.companyName].some((f) =>
        f?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const cutoff = postedAfter(filters.postedRange);
    const filtered = searched.filter((job) => {
      if (filters.types.size && !filters.types.has(job.type)) return false;
      if (cutoff) {
        const posted = getJobPostedDate(job);
        if (!posted || new Date(posted) < cutoff) return false;
      }
      if (filters.hasSalary === true && !job.salary) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dir = sort.order === "asc" ? 1 : -1;
      switch (sort.criteria) {
        case "postedDate":
          return dir * (new Date(getJobPostedDate(a) ?? 0) - new Date(getJobPostedDate(b) ?? 0));
        case "deadline":
          return dir * (new Date(a.deadline) - new Date(b.deadline));
        case "type":
          return dir * a.type.localeCompare(b.type);
        case "title":
          return dir * a.title.localeCompare(b.title);
        case "companyName":
          return dir * a.companyName.localeCompare(b.companyName);
        default:
          return 0;
      }
    });

    return isHome ? sorted.slice(0, 3) : sorted;
  }, [jobs, loading, error, authUser, role, searchTerm, filters, sort, isHome]);

  if (loading)
    return (
      <div className="py-24">
        <Spinner loading />
      </div>
    );
  if (error) return <p className="text-center py-24 text-red-500 text-sm">Failed to load jobs.</p>;

  const hideClosedJobs = !authUser || role === "user";

  if (isHome) {
    return (
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="section-eyebrow mb-3">Open positions</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">
              Recent Listings
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-lg">
              Discover the latest opportunities from companies on the platform.
            </p>
          </div>
          {display.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {display.map((job) => (
                <JobListing key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-16">No open positions right now.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Browse Jobs</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {display.length} {display.length === 1 ? "position" : "positions"} available
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                font-semibold border transition-all shadow-sm
                ${
                  activeCount > 0
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-400 hover:text-brand-600"
                }`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
              {activeCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-brand-700 text-xs font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            {role === "company_admin" && (
              <PostJobLink className="btn-primary px-4 py-2.5">
                <PlusIcon size={11} /> Post a Job
              </PostJobLink>
            )}
          </div>
        </div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="flex gap-7 items-start">
          {/* Sidebar — always visible on desktop, drawer on mobile */}
          <>
            {/* Mobile backdrop */}
            {drawerOpen && (
              <div
                className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
                onClick={() => setDrawerOpen(false)}
                role="presentation"
              />
            )}

            {/* Sidebar / drawer */}
            <aside
              className={`
                shrink-0 w-64
                fixed top-0 right-0 z-40 h-full bg-white shadow-float flex flex-col
                transition-transform duration-300 ease-in-out
                lg:static lg:h-auto lg:shadow-none lg:transition-none lg:translate-x-0 lg:flex lg:flex-col
                ${drawerOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              `}
            >
              {/* Mobile drawer header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 lg:hidden shrink-0">
                <span className="text-sm font-bold text-gray-900">Filters &amp; Sort</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Desktop sidebar title — rendered inside the panel itself */}

              {/* Panel content */}
              <div className="overflow-y-auto flex-1 px-5 py-4 lg:px-0 lg:py-0">
                <JobFilterPanel
                  jobs={jobs}
                  filters={filters}
                  sort={sort}
                  onFilters={handleFilters}
                  onSort={handleSort}
                  onReset={handleReset}
                  activeCount={activeCount}
                />
              </div>
            </aside>
          </>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-5">
              <SearchIcon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={13}
              />
              <input
                type="text"
                placeholder="Search by title or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl
                  text-sm text-gray-900 placeholder:text-gray-400 shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                  hover:border-gray-300 transition-all"
              />
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {[...filters.types].map((t) => (
                  <ActiveChip
                    key={`type-${t}`}
                    label={t}
                    onRemove={() => {
                      const next = new Set(filters.types);
                      next.delete(t);
                      handleFilters({ types: next });
                    }}
                  />
                ))}
                {filters.postedRange !== "any" && (
                  <ActiveChip
                    label={
                      { today: "Today", week: "Past 7 days", month: "Past 30 days" }[
                        filters.postedRange
                      ]
                    }
                    onRemove={() => handleFilters({ postedRange: "any" })}
                  />
                )}
                {filters.hasSalary && (
                  <ActiveChip
                    label="Salary listed"
                    onRemove={() => handleFilters({ hasSalary: null })}
                  />
                )}
                {(sort.criteria !== DEFAULT_SORT.criteria || sort.order !== DEFAULT_SORT.order) && (
                  <ActiveChip
                    label={`Sort: ${sort.criteria} ${sort.order === "asc" ? "↑" : "↓"}`}
                    onRemove={() => setSort(DEFAULT_SORT)}
                  />
                )}
              </div>
            )}

            {/* Grid */}
            {display.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {display.map((job) => (
                  <JobListing key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-sm text-gray-500 font-medium">
                  {hideClosedJobs && !searchTerm && activeCount === 0
                    ? "No open positions right now."
                    : "No jobs match your filters."}
                </p>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-4 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobListings;
