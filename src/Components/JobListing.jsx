import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPinIcon, ClockIcon, BriefcaseIcon, BuildingIcon } from "./icons";
import { isJobOpen } from "../utils/jobs";

const JobListing = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX = 110;
  const desc = expanded
    ? job.description
    : job.description?.substring(0, MAX) + (job.description?.length > MAX ? "…" : "");
  const open = isJobOpen(job);

  return (
    <article className="group surface-card-interactive flex flex-col overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/80 flex items-center
              justify-center text-brand-600 font-bold text-sm shrink-0 shadow-inner-soft">
              {job.companyName?.charAt(0)?.toUpperCase() ?? <BuildingIcon size={14} />}
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

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <BriefcaseIcon className="text-brand-400" size={10} />{job.type}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <MapPinIcon className="text-orange-400" size={10} />{job.location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100
            px-2 py-0.5 rounded-full">
            <ClockIcon size={10} />{job.deadline}
          </span>
        </div>

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
          className="btn-primary w-full text-xs py-2.5"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};

export default JobListing;
