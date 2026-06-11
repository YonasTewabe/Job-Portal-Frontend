import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaBriefcase, FaBuilding } from "react-icons/fa";
import { isJobOpen } from "../utils/jobs";

const JobListing = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX = 110;
  const desc = expanded
    ? job.description
    : job.description?.substring(0, MAX) + (job.description?.length > MAX ? "…" : "");
  const open = isJobOpen(job);

  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-card
      hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Company initial avatar */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center
              justify-center text-brand-600 font-bold text-sm shrink-0">
              {job.companyName?.charAt(0)?.toUpperCase() ?? <FaBuilding size={14} />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 truncate">{job.companyName}</p>
              <h3 className="text-sm font-bold text-gray-900 leading-snug mt-0.5 line-clamp-2">{job.title}</h3>
            </div>
          </div>

          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border
            ${open
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"}`}>
            {open ? "Open" : "Closed"}
          </span>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <FaBriefcase className="text-brand-400" size={10} />{job.type}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <FaMapMarkerAlt className="text-orange-400" size={10} />{job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <FaClock size={10} />{job.deadline}
          </span>
        </div>

        {/* Description */}
        {job.description && (
          <>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            {job.description.length > MAX && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-xs text-brand-600 hover:text-brand-700 hover:underline mt-1 font-medium"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </>
        )}
      </div>

      <div className="px-5 pb-5">
        <Link
          to={`/job/${job.id}`}
          className="btn-primary block w-full text-center bg-brand-600 hover:bg-brand-700 text-white
            text-xs font-semibold py-2.5 rounded-xl transition-all duration-150
            shadow-sm hover:shadow group-hover:shadow-md"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default JobListing;
