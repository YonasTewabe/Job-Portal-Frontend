import Navbar from "./Navbar";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AUTH_PATHS = ["/login", "/signup", "/register/company", "/forgotpassword"];

const Layout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const showPublicNav = !user && !AUTH_PATHS.includes(pathname);

  return (
  <div className="min-h-screen flex flex-col bg-slate-50">
    {user ? <Navbar /> : showPublicNav && <PublicNavbar />}
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      toastClassName="!rounded-xl !shadow-card-hover !text-sm !font-medium"
    />
  </div>
  );
};

export default Layout;
