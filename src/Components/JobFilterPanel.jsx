import { useMemo } from "react";
import { SortUpIcon, SortDownIcon } from "./icons";

const SORT_OPTIONS = [
  { key: "postedDate", label: "Posted date" },
  { key: "deadline", label: "Deadline" },
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "companyName", label: "Company" },
];

const POSTED_RANGES = [
  { key: "any", label: "Any time" },
  { key: "today", label: "Today" },
  { key: "week", label: "Past 7 days" },
  { key: "month", label: "Past 30 days" },
];

const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
      ${
        active
          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600"
      }`}
  >
    {children}
  </button>
);

const Section = ({ label, children }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{label}</p>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const JobFilterPanel = ({ jobs, filters, sort, onFilters, onSort, onReset, activeCount }) => {
  const types = useMemo(() => {
    const t = new Set();
    for (const job of jobs ?? []) {
      if (job.type) t.add(job.type);
    }
    return [...t].sort();
  }, [jobs]);

  const toggleType = (value) => {
    const next = new Set(filters.types);
    next.has(value) ? next.delete(value) : next.add(value);
    onFilters({ types: next });
  };

  const handleSortClick = (key) => {
    if (sort.criteria === key) {
      onSort(key, sort.order === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "desc");
    }
  };

  return (
    <div className="surface-card p-5 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Filters &amp; Sort</h3>
        {activeCount > 0 && (
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
            {activeCount} active
          </span>
        )}
      </div>

      {/* Sort */}
      <Section label="Sort by">
        {SORT_OPTIONS.map(({ key, label }) => {
          const active = sort.criteria === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSortClick(key)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold
                border transition-all
                ${
                  active
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600"
                }`}
            >
              {label}
              {active &&
                (sort.order === "asc" ? (
                  <SortUpIcon size={10} strokeWidth={2.5} />
                ) : (
                  <SortDownIcon size={10} strokeWidth={2.5} />
                ))}
            </button>
          );
        })}
      </Section>

      <div className="border-t border-gray-100" />

      {/* Posted */}
      <Section label="Posted">
        {POSTED_RANGES.map(({ key, label }) => (
          <Pill
            key={key}
            active={filters.postedRange === key}
            onClick={() => onFilters({ postedRange: key })}
          >
            {label}
          </Pill>
        ))}
      </Section>

      {/* Job type */}
      {types.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <Section label="Job type">
            {types.map((t) => (
              <Pill key={t} active={filters.types.has(t)} onClick={() => toggleType(t)}>
                {t}
              </Pill>
            ))}
          </Section>
        </>
      )}

      {/* Salary */}
      <div className="border-t border-gray-100" />
      <Section label="Salary">
        <Pill
          active={filters.hasSalary === true}
          onClick={() => onFilters({ hasSalary: filters.hasSalary === true ? null : true })}
        >
          Listed salary only
        </Pill>
      </Section>

      {/* Reset */}
      {activeCount > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <button
            type="button"
            onClick={onReset}
            className="w-full text-xs font-semibold text-red-500 hover:text-red-700 transition-colors py-1"
          >
            Clear all ({activeCount})
          </button>
        </>
      )}
    </div>
  );
};

export default JobFilterPanel;
