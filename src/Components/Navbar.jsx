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
import Logo from "./Logo";

const menus = {
  user: [
    { icon: <FaHome />, text: "Home",        link: "/" },
    { icon: <FaBriefcase />, text: "Browse Jobs", link: "/jobs" },
    { icon: <FaList />, text: "My Applications", link: "/status" },
  ],
  company_admin: [
    { icon: <FaTachometerAlt />, text: "Dashboard", link: "/company/dashboard" },
    { icon: <FaUserPlus />, text: "Post a Job",  link: "/add-job" },
    { icon: <FaBriefcase />, text: "All Jobs",    link: "/jobs" },
  ],
  admin: [
    { icon: <FaHome />, text: "Home",              link: "/" },
    { icon: <FaUserPlus />, text: "Add HR",         link: "/add-hr" },
    { icon: <FaList />, text: "Registered HR",      link: "/view-hr" },
    { icon: <FaUsers />, text: "Registered Users",  link: "/view-users" },
    { icon: <FaBriefcase />, text: "All Jobs",      link: "/jobs" },
  ],
  superadmin: [
    { icon: <FaTachometerAlt />, text: "Dashboard",    link: "/superadmin/dashboard" },
    { icon: <FaBuilding />, text: "Companies",          link: "/superadmin/companies/new" },
    { icon: <FaBriefcase />, text: "All Jobs",          link: "/jobs" },
  ],
  hr: [
    { icon: <FaHome />, text: "Home",      link: "/" },
    { icon: <FaUserPlus />, text: "Post Job", link: "/add-job" },
    { icon: <FaBriefcase />, text: "Your Jobs", link: "/jobs" },
  ],
};

const NavItem = ({ icon, text, link, onClick }) => (
  <NavLink
    to={link}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
       ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
    }
  >
    <span className="text-lg">{icon}</span>
    {text}
  </NavLink>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;
  const menuItems = menus[role] ?? [];

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout", { withCredentials: true }); }
    catch { /* ignore */ }
    finally { logout(); navigate("/login", { replace: true }); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const profilePath = user.userId ? `/account/${user.userId}` : "/";

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-white p-1.5 rounded-lg hover:bg-white/20 transition"
        >
          <FaBars size={20} />
        </button>

        <Link to="/" className="text-white font-bold text-lg tracking-tight flex-1 truncate flex items-center gap-2">
          <Logo size={26} variant="white" />
          <span className="hidden sm:inline">Application Tracker</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to={profilePath} className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-white/80 transition">
            <MdOutlineAccountCircle size={22} />
            <span className="hidden sm:inline">{user.name || "Profile"}</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-white/80 transition ml-2">
            <CiLogout size={22} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="bg-background px-4 py-4 flex items-center justify-between">
          <Logo size={24} variant="white" showText />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white hover:text-white/70">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map(({ icon, text, link }) => (
            <NavItem key={link} icon={icon} text={text} link={link} onClick={() => setOpen(false)} />
          ))}
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition"
          >
            <CiLogout size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
