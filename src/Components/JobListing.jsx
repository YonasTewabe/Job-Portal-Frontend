import { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaBriefcase } from "react-icons/fa";

const JobListing = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const MAX = 120;
  const desc = expanded ? job.description : job.description?.substring(0, MAX) + (job.description?.length > MAX ? "…" : "");
  const isExpired = new Date(job.deadline) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">{job.companyName}</p>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{job.title}</h3>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${isExpired ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {isExpired ? "Closed" : "Open"}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><FaBriefcase className="text-blue-400" />{job.type}</span>
          <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-orange-400" />{job.location}</span>
          <span className="flex items-center gap-1"><FaClock className="text-gray-400" />{job.deadline}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
        {job.description?.length > MAX && (
          <button onClick={() => setExpanded((v) => !v)}
            className="text-xs text-blue-600 hover:underline mt-1">
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className="px-5 pb-5">
        <Link to={`/job/${job.id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobListing;
