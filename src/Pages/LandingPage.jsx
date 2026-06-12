import { Link, Navigate } from "react-router-dom";
import {
  BriefcaseIcon,
  ClipboardIcon,
  BuildingIcon,
  TrendingUpIcon,
  ArrowRightIcon,
} from "../Components/icons";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/routes";
import { publicAuthState } from "../utils/authNavigation";
import JobListings from "../Components/JobListings";
import ViewAllJobs from "../Components/ViewAllJobs";
import { APP_NAME, APP_TAGLINE } from "../constants/brand";

const features = [
  {
    icon: <BriefcaseIcon size={20} />,
    title: "Browse open roles",
    desc: "Explore job listings from companies across the platform in one place.",
  },
  {
    icon: <ClipboardIcon size={20} />,
    title: "Track every application",
    desc: "Keep all your applications organized — status, deadlines, and follow-ups.",
  },
  {
    icon: <BuildingIcon size={20} />,
    title: "Hire with confidence",
    desc: "Companies post jobs, review applicants, and manage hiring in one dashboard.",
  },
  {
    icon: <TrendingUpIcon size={20} />,
    title: "Stay on top of progress",
    desc: "Real-time updates so job seekers and recruiters always know what's next.",
  },
];

const stats = [
  { value: "1 place", label: "All your applications" },
  { value: "Real-time", label: "Status updates" },
  { value: "Free", label: "To get started" },
];

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-surface pt-14 relative">
        <div
          className="hero-orb w-72 h-72 bg-brand-300/30 -top-20 -right-20"
          aria-hidden
        />
        <div
          className="hero-orb w-56 h-56 bg-brand-400/20 top-32 -left-16"
          style={{ animationDelay: "2s" }}
          aria-hidden
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="section-eyebrow mb-6 animate-fade-up">
            Ethiopia&apos;s career platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900
            leading-[1.1] tracking-tight mb-6 animate-fade-up stagger-1">
            Track applications.<br className="hidden sm:block" /> Land your next role.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up stagger-2">
            {APP_NAME} helps Ethiopian job seekers manage applications and helps companies
            find the right talent — {APP_TAGLINE.toLowerCase()}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-up stagger-3">
            <Link
              to="/signup"
              state={publicAuthState}
              className="w-full sm:w-auto btn-primary px-8 py-3.5 rounded-2xl text-sm shadow-glow"
            >
              Get started free
              <ArrowRightIcon size={12} />
            </Link>
            <Link
              to="/jobs"
              className="w-full sm:w-auto btn-outline-brand px-8 py-3.5 rounded-2xl text-sm"
            >
              Browse open jobs
            </Link>
          </div>

          <p className="text-sm text-slate-500 animate-fade-up stagger-4">
            Free to join · No credit card required
          </p>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-up stagger-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="surface-card px-5 py-4 text-center"
              >
                <p className="text-lg font-bold text-brand-700 tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <div className="border-t border-slate-200/60 bg-white/50">
        <JobListings isHome />
        <ViewAllJobs />
      </div>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-eyebrow mb-4">Platform features</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3 mt-4">
              Everything you need in one platform
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Whether you're applying or hiring, register to unlock the full experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="surface-card-interactive p-6 flex gap-4 group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100
                  border border-brand-200/80 flex items-center justify-center text-brand-600
                  shadow-inner-soft group-hover:scale-105 transition-transform duration-300">
                  {icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto cta-banner rounded-3xl px-8 py-12 sm:py-14 text-center relative">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-brand-100 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
              Create your account in minutes, or log in if you already have one.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                state={publicAuthState}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white
                  text-brand-700 font-bold px-8 py-3 rounded-2xl text-sm
                  hover:bg-brand-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Sign up as job seeker
              </Link>
              <Link
                to="/register/company"
                state={publicAuthState}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10
                  text-white font-bold px-8 py-3 rounded-2xl text-sm
                  border border-white/25 hover:bg-white/20 transition-all hover:-translate-y-0.5"
              >
                Register your company
              </Link>
              <Link
                to="/login"
                state={publicAuthState}
                className="w-full sm:w-auto inline-flex items-center justify-center
                  text-white font-semibold px-8 py-3 rounded-2xl text-sm
                  border border-white/25 hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
