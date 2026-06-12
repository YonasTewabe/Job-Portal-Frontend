import { Link } from "react-router-dom";
import Logo from "./Logo";
import { APP_NAME, APP_TAGLINE } from "../constants/brand";

const Footer = () => (
  <footer className="bg-white border-t border-slate-200/80 mt-auto">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Logo size={24} variant="color" showText />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            {APP_TAGLINE}. Track applications and connect talent with opportunity.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Platform</h3>
          <nav className="flex flex-col gap-2.5">
            <Link to="/jobs" className="text-sm link-muted w-fit">Browse jobs</Link>
            <Link to="/signup" className="text-sm link-muted w-fit">Sign up</Link>
            <Link to="/register/company" className="text-sm link-muted w-fit">For companies</Link>
          </nav>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Company</h3>
          <nav className="flex flex-col gap-2.5">
            <Link to="/contact" className="text-sm link-muted w-fit">Contact</Link>
            <Link to="/about" className="text-sm link-muted w-fit">About</Link>
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <p className="text-xs text-slate-400">
          Built for job seekers and recruiters
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
