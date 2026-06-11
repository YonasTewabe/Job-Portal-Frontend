import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const content = {
  user: {
    heading: "Find Your Next Opportunity",
    sub: "Browse open roles, track every application, and land your dream job — all in one place.",
    cta: { label: "Browse Jobs", to: "/jobs" },
    badge: "Job Seeker",
  },
  company_admin: {
    heading: "Find Your Next Employee",
    sub: "Post jobs, review applicants, and schedule interviews — faster than ever.",
    cta: { label: "Post a Job", to: "/add-job" },
    badge: "Company Admin",
  },
  superadmin: {
    heading: "Platform Dashboard",
    sub: "Manage companies, monitor activity, and keep the platform running smoothly.",
    cta: { label: "Go to Dashboard", to: "/superadmin/dashboard" },
    badge: "Super Admin",
  },
  admin: {
    heading: "Platform Administration",
    sub: "Oversee HR accounts, registered users, and job listings across the platform.",
    cta: { label: "View Users", to: "/view-users" },
    badge: "Admin",
  },
  hr: {
    heading: "Find Your Next Employee",
    sub: "Post jobs and track your applicants with ease.",
    cta: { label: "Post a Job", to: "/add-job" },
    badge: "HR",
  },
};

const Hero = () => {
  const { user } = useAuth();
  const c = content[user?.role] ?? content.user;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 pt-14">
      {/* Subtle grid pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow blobs */}
      <div aria-hidden className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-brand-400/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-brand-800/40 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        {/* Role badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white/90
          text-xs font-semibold px-3 py-1 rounded-full border border-white/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {c.badge}
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
          {c.heading}
        </h1>

        <p className="text-base sm:text-lg text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
          {c.sub}
        </p>

        <Link
          to={c.cta.to}
          className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold
            px-7 py-3.5 rounded-2xl shadow-float hover:bg-brand-50 hover:shadow-lg
            transition-all duration-200 text-sm"
        >
          {c.cta.label}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Bottom fade into page bg */}
      <div aria-hidden className="h-12 bg-gradient-to-b from-transparent to-slate-50" />
    </section>
  );
};

export default Hero;
