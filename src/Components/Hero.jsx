import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const content = {
  user: {
    heading: "Find Your Next Opportunity",
    sub: "Browse hundreds of open roles and apply in seconds.",
    cta: { label: "Browse Jobs", to: "/jobs" },
  },
  company_admin: {
    heading: "Find Your Next Employee",
    sub: "Post jobs and manage your applicants all in one place.",
    cta: { label: "Post a Job", to: "/add-job" },
  },
  superadmin: {
    heading: "Super Admin Dashboard",
    sub: "Manage companies, users, and platform settings.",
    cta: { label: "Go to Dashboard", to: "/superadmin/dashboard" },
  },
  admin: {
    heading: "Platform Administration",
    sub: "Oversee HR accounts, users, and job listings.",
    cta: { label: "View Users", to: "/view-users" },
  },
  hr: {
    heading: "Find Your Next Employee",
    sub: "Post jobs and track your applicants.",
    cta: { label: "Post a Job", to: "/add-job" },
  },
};

const Hero = () => {
  const { user } = useAuth();
  const c = content[user?.role] ?? content.user;

  return (
    <section className="bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Logo size={56} variant="white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
          {c.heading}
        </h1>
        <p className="text-lg text-white/80 mb-8">{c.sub}</p>
        <Link to={c.cta.to}
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3 rounded-full shadow hover:bg-blue-50 transition text-sm">
          {c.cta.label} →
        </Link>
      </div>
    </section>
  );
};

export default Hero;
