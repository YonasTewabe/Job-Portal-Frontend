import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />
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

export default Layout;
