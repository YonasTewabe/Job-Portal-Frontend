import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <div className="flex-1">
      <Outlet />
    </div>
    <Footer />
    <ToastContainer position="top-right" autoClose={3000} />
  </div>
);

export default Layout;
