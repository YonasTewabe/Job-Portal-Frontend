import { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { CiLogout, CiViewList } from "react-icons/ci";
import { MdOutlineAccountCircle, MdSummarize } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { useNavigate, NavLink } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "../axiosInterceptor";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const sidebarRef = useRef(null);
  const linkClass = ({ isActive }) => (isActive ? "text-[#3b82f6]" : "");
  const role = localStorage.getItem("role");

  const hrMenu = [
    {
      icon: <FaHome size={25} className="mr-4" />,
      text: "Home",
      link: "/",
      className: { linkClass },
    },
    {
      icon: <GoPlusCircle size={25} className="mr-4" />,
      text: "Add Job",
      link: "/add-job",
      className: { linkClass },
    },
    {
      icon: <MdSummarize size={25} className="mr-4" />,
      text: "Your Jobs",
      link: "/jobs",
      className: { linkClass },
    },
  ];

  const adminMenu = [
    {
      icon: <FaHome size={25} className="mr-4" />,
      text: "Home",
      link: "/",
      className: { linkClass },
    },
    {
      icon: <IoMdPersonAdd size={25} className="mr-4" />,
      text: "Add Hr",
      link: "/add-hr",
      className: { linkClass },
    },
    {
      icon: <CiViewList size={25} className="mr-4" />,
      text: "Registered Hr",
      link: "/view-hr",
      className: { linkClass },
    },
    {
      icon: <CiViewList size={25} className="mr-4" />,
      text: "Registered Users",
      link: "/view-users",
      className: { linkClass },
    },
    {
      icon: <MdSummarize size={25} className="mr-4" />,
      text: "All Jobs",
      link: "/jobs",
      className: { linkClass },
    },
  ];

  const userMenu = [
    {
      icon: <FaHome size={25} className="mr-4" />,
      text: "Home",
      link: "/",
      className: { linkClass },
    },
    {
      icon: <CiViewList size={25} className="mr-4" />,
      text: "All Jobs",
      link: "/jobs",
      className: { linkClass },
    },
    {
      icon: <MdSummarize size={25} className="mr-4" />,
      text: "Applied Jobs",
      link: "/status",
      className: { linkClass },
    },
  ];

  const handleOutsideClick = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setNav(false);
    }
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/profile/logout", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      Cookies.remove("userId");
      Cookies.remove("jwt");
      Cookies.remove("jobId");
      localStorage.removeItem("role");
      localStorage.removeItem("usercompleted");
      localStorage.removeItem("hrcompleted");
      localStorage.removeItem("hrStatus");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const storedId = Cookies.get("userId");
  const value = storedId ? `/account/${storedId}` : "/";

  if (role !== "user" && role !== "admin" && role !== "hr") {
    return null;
  }

  return (
    <div className="max-w-[1940px] mx-auto flex justify-between items-center p-1 shadow-sm bg-background fixed top-0 left-0 w-full z-50">
      <div className="flex items-center">
        <div onClick={() => setNav(!nav)} className="cursor-pointer text-white">
          <AiOutlineMenu size={30} />
        </div>

        <NavLink to="/">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl px-2 text-white font-bold">
            Application Tracker
          </h1>
        </NavLink>
      </div>

      <div className="flex items-center">
        <NavLink to={value} className="text-white mr-4">
          <MdOutlineAccountCircle size={30} /> My Profile
        </NavLink>
        <button className="text-white" onClick={handleLogout}>
          <CiLogout size={30} /> Logout
        </button>
      </div>

      {nav && (
        <div className="bg-black/80 fixed w-full h-screen z-60 top-0 left-0"></div>
      )}

      <div
        ref={sidebarRef}
        className={
          nav
            ? "fixed top-0 left-0 w-[270px] h-screen bg-white z-70 duration-300"
            : "fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-70 duration-300"
        }
      >
        <div className="bg-background">
          <h2 className="text-2xl p-2">Menu</h2>
        </div>
        <nav>
          <ul className="flex flex-col p-4 text-gray-800">
            {role == "user" &&
              userMenu.map(({ icon, text, link }, index) => {
                return (
                  <div key={index} className=" py-4">
                    <NavLink
                      to={link}
                      className={linkClass}
                      onClick={() => setNav(false)}
                    >
                      <li className="text-xl flex cursor-pointer  w-[95%] mx-auto hover:bg-[#e1e9f0]">
                        {icon} {text}
                      </li>
                    </NavLink>
                  </div>
                );
              })}
            {role == "admin" &&
              adminMenu.map(({ icon, text, link }, index) => {
                return (
                  <div key={index} className=" py-4">
                    <NavLink
                      to={link}
                      className={linkClass}
                      onClick={() => setNav(false)}
                    >
                      <li className="text-xl flex cursor-pointer  w-[95%] mx-auto hover:bg-[#e1e9f0]">
                        {icon} {text}
                      </li>
                    </NavLink>
                  </div>
                );
              })}
            {role == "hr" &&
              hrMenu.map(({ icon, text, link }, index) => {
                return (
                  <div key={index} className=" py-4">
                    <NavLink
                      to={link}
                      className={linkClass}
                      onClick={() => setNav(false)}
                    >
                      <li className="text-xl flex cursor-pointer  w-[95%] mx-auto hover:bg-[#e1e9f0]">
                        {icon} {text}
                      </li>
                    </NavLink>
                  </div>
                );
              })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
