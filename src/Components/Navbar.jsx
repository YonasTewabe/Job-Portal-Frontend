import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  FaHome, FaBriefcase, FaUserPlus, FaList, FaUsers,
  FaBuilding, FaTachometerAlt, FaBars, FaTimes,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdOutlineAccountCircle } from "react-icons/md";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/routes";
import { useCompany } from "../hooks/useCompany";
import { APP_NAME } from "../constants/brand";
import Logo from "./Logo";

const menus = {
  user: [
    { icon: <FaHome />,      text: "Home",            link: "/home" },
    { icon: <FaBriefcase />, text: "Browse Jobs",      link: "/jobs" },
    { icon: <FaList />,      text: "My Applications",  link: "/status" },
  ],
  company_admin: [
    { icon: <FaTachometerAlt />, text: "Dashboard", link: "/company/dashboard" },
    { icon: <FaUserPlus />,      text: "Post a Job", link: "/add-job" },
    { icon: <FaBriefcase />,     text: "All Jobs",   link: "/jobs" },
  ],
  admin: [
    { icon: <FaHome />,      text: "Home",             link: "/home" },
    { icon: <FaUserPlus />,  text: "Add HR",            link: "/add-hr" },
    { icon: <FaList />,      text: "Registered HR",     link: "/view-hr" },
    { icon: <FaUsers />,     text: "Registered Users",  link: "/view-users" },
    { icon: <FaBriefcase />, text: "All Jobs",          link: "/jobs" },
  ],
  superadmin: [
    { icon: <FaTachometerAlt />, text: "Dashboard", link: "/superadmin/dashboard" },
    { icon: <FaBuilding />,      text: "Companies",  link: "/superadmin/companies" },
    { icon: <FaBriefcase />,     text: "All Jobs",   link: "/jobs" },
  ],
  hr: [
    { icon: <FaHome />,      text: "Home",       link: "/home" },
    { icon: <FaUserPlus />,  text: "Post Job",   link: "/add-job" },
    { icon: <FaBriefcase />, text: "Your Jobs",  link: "/jobs" },
  ],
};

const NavItem = ({ icon, text, link, onClick, disabled }) => {
  const baseCls =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150";

  if (disabled) {
    return (
      <span
        className={`${baseCls} text-gray-400 opacity-60 cursor-not-allowed`}
        title="Posting is disabled while your company account is suspended"
        aria-disabled="true"
      >
        <span className="text-base opacity-80">{icon}</span>
        {text}
      </span>
    );
  }

  return (
    <NavLink
      to={link}
      onClick={onClick}
      className={({ isActive }) =>
        `${baseCls}
         ${isActive
           ? "nav-item-active shadow-sm"
           : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`
      }
    >
      <span className="text-base opacity-80">{icon}</span>
      {text}
    </NavLink>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;
  const menuItems = menus[role] ?? [];
  const { isSuspended } = useCompany();

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout", { withCredentials: true }); }
    catch { /* ignore */ }
    finally { logout(); navigate("/", { replace: true }); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const profilePath = "/profile";
  const dashboardPath = getDefaultRoute(role);

  return (
    <>
      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3
        bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="shrink-0 p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
        >
          <FaBars size={18} />
        </button>

        <div className="flex flex-1 items-center min-w-0">
          <Link
            to={dashboardPath}
            className="inline-flex items-center rounded-xl px-1 py-1
              hover:bg-gray-50/80 transition-colors"
            aria-label={`${APP_NAME} dashboard`}
          >
            <Logo size={28} variant="color" showText />
          </Link>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={profilePath}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900
              px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            <MdOutlineAccountCircle size={20} className="text-gray-500" />
            <span className="hidden sm:inline">{user.name || "Profile"}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600
              px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all"
          >
            <CiLogout size={20} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* ── Backdrop overlay ──────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          border-r border-gray-100 shadow-float
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <Link
            to={dashboardPath}
            onClick={() => setOpen(false)}
            className="inline-flex items-center rounded-xl -ml-1 px-1 py-0.5
              hover:bg-gray-50 transition-colors"
            aria-label={`${APP_NAME} dashboard`}
          >
            <Logo size={28} variant="color" showText />
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* User pill */}
        <div className="px-4 pt-4 pb-2">
          <Link
            to={profilePath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100
              hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
              <MdOutlineAccountCircle size={20} className="text-brand-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "Account"}</p>
              <p className="text-xs text-gray-400 capitalize">{role?.replace("_", " ")}</p>
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {menuItems.map(({ icon, text, link }) => (
            <NavItem
              key={link}
              icon={icon}
              text={text}
              link={link}
              onClick={() => setOpen(false)}
              disabled={link === "/add-job" && isSuspended}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium
              text-red-600 hover:bg-red-50 w-full transition-all duration-150"
          >
            <CiLogout size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
