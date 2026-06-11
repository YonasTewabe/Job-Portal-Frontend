import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const content = {
  user: {
    heading: "Find Your Next Opportunity",
    sub: "Browse open roles, track every application, and land your dream job — all in one place.",
    cta: { label: "Browse Jobs", to: "/jobs" },
  },
  company_admin: {
    heading: "Find Your Next Employee",
    sub: "Post jobs, review applicants, and schedule interviews — faster than ever.",
    cta: { label: "Post a Job", to: "/add-job" },
  },
  superadmin: {
    heading: "Platform Dashboard",
    sub: "Manage companies, monitor activity, and keep the platform running smoothly.",
    cta: { label: "Go to Dashboard", to: "/superadmin/dashboard" },
  },
  admin: {
    heading: "Platform Administration",
    sub: "Oversee HR accounts, registered users, and job listings across the platform.",
    cta: { label: "View Users", to: "/view-users" },
  },
  hr: {
    heading: "Find Your Next Employee",
    sub: "Post jobs and track your applicants with ease.",
    cta: { label: "Post a Job", to: "/add-job" },
  },
};

const Hero = () => {
  const { user } = useAuth();
  const c = content[user?.role] ?? content.user;

  return (
    <section className="relative overflow-hidden hero-surface pt-14">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">


        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          {c.heading}
        </h1>

        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
          {c.sub}
        </p>

        <Link
          to={c.cta.to}
          className="btn-primary inline-flex items-center gap-2 font-bold
            px-7 py-3.5 rounded-2xl shadow-float hover:shadow-lg
            transition-all duration-200 text-sm"
        >
          {c.cta.label}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
