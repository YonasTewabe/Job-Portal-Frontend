import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useCompany } from "../hooks/useCompany";
import PostJobLink from "./PostJobLink";

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
};

const Hero = () => {
  const { user } = useAuth();
  const { isSuspended } = useCompany();
  const c = content[user?.role] ?? content.user;
  const isPostJobCta = c.cta.to === "/add-job";

  const ctaClassName = "btn-primary px-7 py-3.5 rounded-2xl shadow-float hover:shadow-lg";

  return (
    <section className="relative overflow-hidden hero-surface pt-14">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">


        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          {c.heading}
        </h1>

        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
          {c.sub}
        </p>

        {isPostJobCta ? (
          <PostJobLink className={ctaClassName}>
            {c.cta.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </PostJobLink>
        ) : (
          <Link to={c.cta.to} className={ctaClassName}>
            {c.cta.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}

        {isPostJobCta && isSuspended && (
          <p className="mt-4 text-sm text-amber-600 font-medium">
            Job posting is disabled while your company account is suspended.
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
