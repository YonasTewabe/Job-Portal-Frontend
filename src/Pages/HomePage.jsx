import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../Components/Hero";
import JobListings from "../Components/JobListings";
import ViewAllJobs from "../Components/ViewAllJobs";
import Cookies from "js-cookie";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwt");
    if (!jwtToken) {
      // Set a timeout before navigating to login page
      const timeoutId = setTimeout(() => {
        navigate("/login");
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [navigate]);

  return (
    <>
      <Hero />
      <JobListings isHome={true} />
      <ViewAllJobs />
    </>
  );
};

export default HomePage;
