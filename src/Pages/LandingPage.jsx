import { Link, Navigate } from "react-router-dom";
import { FaBriefcase, FaClipboardList, FaBuilding, FaChartLine } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/routes";
import { publicAuthState } from "../utils/authNavigation";
import JobListings from "../Components/JobListings";
import ViewAllJobs from "../Components/ViewAllJobs";

const features = [
  {
    icon: <FaBriefcase size={20} />,
    title: "Browse open roles",
    desc: "Explore job listings from companies across the platform in one place.",
  },
  {
    icon: <FaClipboardList size={20} />,
    title: "Track every application",
    desc: "Keep all your applications organized — status, deadlines, and follow-ups.",
  },
  {
    icon: <FaBuilding size={20} />,
    title: "Hire with confidence",
    desc: "Companies post jobs, review applicants, and manage hiring in one dashboard.",
  },
  {
    icon: <FaChartLine size={20} />,
    title: "Stay on top of progress",
    desc: "Real-time updates so job seekers and recruiters always know what's next.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-surface pt-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-800
            text-xs font-semibold px-3 py-1 rounded-full border border-brand-200 mb-6">
            Your career, organized
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900
            leading-tight tracking-tight mb-6">
            Track applications.<br className="hidden sm:block" /> Land your next role.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Application Tracker helps job seekers manage applications and helps companies
            find the right talent — sign in or create an account to get started.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/jobs"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl shadow-float"
            >
              Browse jobs
            </Link>
            <Link
              to="/login"
              state={publicAuthState}
              className="btn-outline-brand w-full sm:w-auto px-8 py-3.5 rounded-2xl"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              state={publicAuthState}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl shadow-float"
            >
              Sign up
            </Link>
            <Link
              to="/register/company"
              state={publicAuthState}
              className="btn-ghost w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-brand-200"
            >
              Register company
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Free to join · No credit card required
          </p>
        </div>
      </section>

      {/* Open positions */}
      <JobListings isHome />
      <ViewAllJobs />

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Everything you need in one platform
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Whether you're applying or hiring, register to unlock the full experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="surface-card-interactive p-6 flex gap-4 hover:translate-y-0"
              >
                <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100
                  flex items-center justify-center text-brand-600">
                  {icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-brand-600 rounded-3xl px-8 py-12 text-center shadow-float">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-brand-100 text-sm mb-8 max-w-md mx-auto">
            Create your account in minutes, or log in if you already have one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              state={publicAuthState}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white
                text-brand-700 font-bold px-8 py-3 rounded-2xl text-sm
                hover:bg-brand-50 transition-all shadow-sm"
            >
              Sign up as job seeker
            </Link>
            <Link
              to="/register/company"
              state={publicAuthState}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10
                text-white font-bold px-8 py-3 rounded-2xl text-sm
                border border-white/30 hover:bg-white/20 transition-all"
            >
              Register company
            </Link>
            <Link
              to="/login"
              state={publicAuthState}
              className="w-full sm:w-auto inline-flex items-center justify-center
                text-white font-semibold px-8 py-3 rounded-2xl text-sm
                border border-white/30 hover:bg-white/10 transition-all"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
