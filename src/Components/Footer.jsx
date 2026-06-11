import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Logo size={22} variant="color" />
          <span className="text-sm font-semibold text-gray-700 tracking-tight">Application Tracker</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Contact
          </Link>
          <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Application Tracker
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
