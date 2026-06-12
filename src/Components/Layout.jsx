import Navbar from "./Navbar";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, Slide } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const AUTH_PATHS = ["/login", "/signup", "/register/company", "/forgotpassword"];

const Layout = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const showPublicNav = !user && !AUTH_PATHS.includes(pathname);

  return (
  <div className="app-shell">
    {user ? <Navbar /> : showPublicNav && <PublicNavbar />}
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
    <ToastContainer
      position="top-right"
      autoClose={3200}
      newestOnTop
      limit={4}
      transition={Slide}
      toastClassName="app-toast"
      progressClassName="app-toast-progress"
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
    />
  </div>
  );
};

export default Layout;
