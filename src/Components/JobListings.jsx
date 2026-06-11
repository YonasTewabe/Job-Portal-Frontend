import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import JobListing from "./JobListing";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

const JobListings = ({ isHome = false }) => {
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [sortOrder,    setSortOrder]    = useState(isHome ? "desc" : "asc");
  const [sortCriteria, setSortCriteria] = useState("");

  const { user: authUser } = useAuth();
  const role      = authUser?.role;
  const companyId = authUser?.companyId;

  useEffect(() => {
    // Pass companyId when available so company_admin only sees their own jobs
    const url = companyId
      ? `/api/jobs?companyId=${companyId}`
      : "/api/jobs";
    axios.get(url)
      .then((r) => setJobs(Array.isArray(r.data) ? r.data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading) return <div className="py-20"><Spinner loading /></div>;
  if (error)   return <p className="text-center py-20 text-red-500">Failed to load jobs.</p>;

  const filtered = jobs.filter((job) =>
    [job.title, job.requirement, job.companyName, job.description]
      .some((f) => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sorted = sortCriteria === "" ? filtered : [...filtered].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    switch (sortCriteria) {
      case "deadline":    return dir * (new Date(a.deadline) - new Date(b.deadline));
      case "type":        return dir * a.type.localeCompare(b.type);
      case "title":       return dir * a.title.localeCompare(b.title);
      case "companyName": return dir * a.companyName.localeCompare(b.companyName);
      default:            return 0;
    }
  });

  // Backend already filters by companyId when passed, so show all returned results
  const display = isHome ? sorted.slice(0, 3) : sorted;

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isHome ? "Recent Listings" : "Browse Jobs"}
        </h2>

        {!isHome && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search by title, company, skills…"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}
                  className="pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                  <option value="">Sort by…</option>
                  <option value="title">Title</option>
                  <option value="companyName">Company</option>
                  <option value="deadline">Deadline</option>
                  <option value="type">Type</option>
                </select>
              </div>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="asc">↑ Asc</option>
                <option value="desc">↓ Desc</option>
              </select>
            </div>
          </div>
        )}

        {display.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {display.map((job) => <JobListing key={job.id} job={job} />)}
          </div>
        ) : (
          <p className="text-center py-16 text-gray-400">No jobs found.</p>
        )}

        {!isHome && role === "company_admin" && (
          <div className="mt-8 text-center">
            <Link to="/add-job"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
              + Post a New Job
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
