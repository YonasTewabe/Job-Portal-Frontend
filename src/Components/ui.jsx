import { Children } from "react";

// ─── Input ────────────────────────────────────────────────────────────────────
export const inputCls = (error) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm text-gray-900 bg-white
   shadow-sm transition-all duration-150
   placeholder:text-gray-400
   focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
   disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
   ${error
     ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
     : "border-gray-200 hover:border-gray-300"}`;

export const Field = ({ label, htmlFor, error, hint, children }) => (
  <div className="mb-5">
    {label && (
      <label htmlFor={htmlFor} className="block mb-1.5 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    {children}
    {hint  && !error && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">{error}</p>}
  </div>
);

// ─── Buttons (styles defined in index.css) ────────────────────────────────────
export const Btn = {
  primary:   (cls = "") => `btn-primary ${cls}`,
  secondary: (cls = "") => `btn-secondary ${cls}`,
  danger:    (cls = "") => `btn-danger ${cls}`,
  success:   (cls = "") => `btn-success ${cls}`,
  ghost:     (cls = "") => `btn-ghost ${cls}`,
  warning:   (cls = "") => `btn-warning ${cls}`,
  full:      (variant, cls = "") => Btn[variant](`w-full ${cls}`),
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-card p-6 ${className}`}>
    {children}
  </div>
);

// ─── Section headings ─────────────────────────────────────────────────────────
export const PageTitle = ({ children, className = "" }) => (
  <h1 className={`text-2xl font-bold text-gray-900 tracking-tight ${className}`}>{children}</h1>
);

export const SectionTitle = ({ children }) => (
  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{children}</h2>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <div className="py-3 border-b border-gray-50 last:border-0 flex flex-col sm:flex-row sm:items-center gap-1">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide sm:w-44 shrink-0">{label}</span>
    <span className="text-sm text-gray-800 font-medium">{value ?? "—"}</span>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusColors = {
  Pending:               "bg-amber-50 text-amber-700 border border-amber-200",
  "Under Consideration": "bg-blue-50 text-blue-700 border border-blue-200",
  "Interview Scheduled": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Rejected:              "bg-red-50 text-red-700 border border-red-200",
  Active:                "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Closed:                "bg-red-50 text-red-700 border border-red-200",
  Suspended:             "bg-red-50 text-red-700 border border-red-200",
};

export const Badge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
    {status}
  </span>
);

// ─── Stat tile ────────────────────────────────────────────────────────────────
export const StatTile = ({ label, value, color = "text-brand-600" }) => (
  <Card>
    <p className={`text-3xl font-extrabold tracking-tight ${color}`}>{value}</p>
    <p className="text-xs font-medium text-gray-400 mt-1">{label}</p>
  </Card>
);

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ headers, children, empty }) => {
  const hasRows = Children.count(children) > 0;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead>
          <tr className="bg-gray-50/80">
            {headers.map((h) => (
              <th
                key={h.key ?? h.label}
                onClick={h.onClick}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider
                  ${h.onClick ? "cursor-pointer select-none hover:text-gray-600 transition-colors" : ""}`}
              >
                {h.label}{h.sort}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {hasRows ? children : null}
        </tbody>
      </table>
      {!hasRows && empty}
    </div>
  );
};

export const Tr = ({ children, striped, onClick, className = "" }) => (
  <tr
    onClick={onClick}
    className={`transition-colors ${striped ? "bg-slate-50/40" : "bg-white"} hover:bg-brand-50/30
      ${onClick ? "cursor-pointer" : ""} ${className}`}
  >
    {children}
  </tr>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 text-gray-700 ${className}`}>{children}</td>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
export const Empty = ({ message = "No data found.", icon = "📭" }) => (
  <div className="py-20 text-center">
    <p className="text-3xl mb-3">{icon}</p>
    <p className="text-sm text-gray-500 font-medium">{message}</p>
  </div>
);

// ─── Auth card wrapper ────────────────────────────────────────────────────────
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export const AuthBackHome = () => {
  const { state } = useLocation();
  if (!state?.fromPublic) return null;

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium link-muted mb-4"
    >
      <span aria-hidden>←</span> Back to home
    </Link>
  );
};

export const AuthCard = ({ title, subtitle, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-md">
      <AuthBackHome />
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-float border border-gray-100 px-8 py-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Logo size={44} variant="color" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export const Page = ({ children, className = "" }) => (
  <main className={`pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto ${className}`}>
    {children}
  </main>
);

// ─── Form card wrapper ────────────────────────────────────────────────────────
export const FormCard = ({ title, subtitle, children, onSubmit }) => {
  const body = onSubmit ? (
    <form onSubmit={onSubmit} noValidate>{children}</form>
  ) : (
    children
  );

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
      <Card>
        {title && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        )}
        {body}
      </Card>
    </div>
  );
};

// ─── Section divider label ────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-gray-100" />
    {label && <span className="text-xs font-medium text-gray-400 uppercase tracking-widest shrink-0">{label}</span>}
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);
