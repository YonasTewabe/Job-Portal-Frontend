import { Link } from "react-router-dom";
import Logo from "./Logo";
import { APP_NAME } from "../constants/brand";
import { publicAuthState } from "../utils/authNavigation";

const PublicNavbar = () => (
  <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 sm:px-6 gap-4
    bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <Link
      to="/"
      className="flex flex-1 items-center min-w-0 h-14 -ml-4 sm:-ml-6 pl-4 sm:pl-6
        rounded-none hover:bg-gray-50/80 transition-colors"
      aria-label={`${APP_NAME} home`}
    >
      <Logo size={28} variant="color" showText />
    </Link>

    <div className="flex items-center gap-2 shrink-0">
      <Link to="/jobs" className="hidden sm:inline text-sm font-semibold link-nav px-3 py-2 rounded-xl">
        Browse jobs
      </Link>
      <Link
        to="/register/company"
        state={publicAuthState}
        className="hidden sm:inline text-sm font-semibold text-brand-700 hover:text-brand-800
          px-3 py-2 rounded-xl hover:bg-brand-50 transition-all"
      >
        For companies
      </Link>
      <Link to="/login" state={publicAuthState} className="text-sm font-semibold link-nav px-3.5 py-2 rounded-xl">
        Log in
      </Link>
      <Link to="/signup" state={publicAuthState} className="btn-primary text-sm px-3.5 py-2">
        Sign up
      </Link>
    </div>
  </header>
);

export default PublicNavbar;
