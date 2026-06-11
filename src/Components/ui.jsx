/**
 * Lightweight shared UI primitives — no extra dependencies.
 * Uses Tailwind classes already configured in the project.
 */

// ─── Input ────────────────────────────────────────────────────────────────────
export const inputCls = (error) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 shadow-sm
   transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
   disabled:bg-gray-50 disabled:cursor-not-allowed
   ${error ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`;

export const Field = ({ label, htmlFor, error, children }) => (
  <div className="mb-5">
    {label && (
      <label htmlFor={htmlFor} className="block mb-1.5 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// ─── Buttons ──────────────────────────────────────────────────────────────────
const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

export const Btn = {
  primary:   (cls = "") => `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 ${cls}`,
  secondary: (cls = "") => `${base} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 ${cls}`,
  danger:    (cls = "") => `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 ${cls}`,
  success:   (cls = "") => `${base} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 ${cls}`,
  ghost:     (cls = "") => `${base} text-blue-600 hover:bg-blue-50 focus:ring-blue-400 ${cls}`,
  full:      (variant, cls = "") => Btn[variant](`w-full ${cls}`),
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
export const PageTitle = ({ children }) => (
  <h1 className="text-2xl font-bold text-gray-900 mb-6">{children}</h1>
);

export const SectionTitle = ({ children }) => (
  <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-4">{children}</h2>
);

// ─── Info row (label + value) ─────────────────────────────────────────────────
export const InfoRow = ({ label, value }) => (
  <div className="py-3 border-b border-gray-100 last:border-0 flex flex-col sm:flex-row sm:items-center gap-1">
    <span className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{label}</span>
    <span className="text-sm text-gray-900 font-medium">{value ?? "—"}</span>
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusColors = {
  Pending:              "bg-yellow-100 text-yellow-800",
  "Under Consideration":"bg-blue-100 text-blue-800",
  "Interview Scheduled":"bg-green-100 text-green-800",
  Rejected:             "bg-red-100 text-red-800",
  Active:               "bg-green-100 text-green-800",
  Suspended:            "bg-red-100 text-red-800",
};

export const Badge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] ?? "bg-gray-100 text-gray-700"}`}>
    {status}
  </span>
);

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ headers, children, empty }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-100">
    <table className="min-w-full divide-y divide-gray-100 text-sm">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h) => (
            <th key={h.key ?? h.label} onClick={h.onClick}
              className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${h.onClick ? "cursor-pointer select-none hover:text-gray-700" : ""}`}>
              {h.label}{h.sort}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 bg-white">
        {children}
      </tbody>
    </table>
    {empty}
  </div>
);

export const Tr = ({ children, striped }) => (
  <tr className={`transition ${striped ? "bg-gray-50/50" : "bg-white"} hover:bg-blue-50/30`}>
    {children}
  </tr>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
export const Empty = ({ message = "No data found." }) => (
  <div className="py-16 text-center text-gray-400 text-sm">{message}</div>
);

// ─── Auth card wrapper ────────────────────────────────────────────────────────
import Logo from "./Logo";

export const AuthCard = ({ title, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 px-8 py-10">
      <div className="flex flex-col items-center mb-8 gap-3">
        <Logo size={44} variant="color" />
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {children}
    </div>
  </div>
);

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export const Page = ({ children, className = "" }) => (
  <main className={`pt-20 pb-12 px-4 max-w-5xl mx-auto ${className}`}>
    {children}
  </main>
);

// ─── Form wrapper ─────────────────────────────────────────────────────────────
export const FormCard = ({ title, children, onSubmit }) => (
  <div className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
    <Card>
      {title && <h1 className="text-2xl font-bold text-gray-900 mb-8">{title}</h1>}
      <form onSubmit={onSubmit} noValidate>{children}</form>
    </Card>
  </div>
);
