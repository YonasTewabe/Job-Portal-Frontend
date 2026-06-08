import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "../axiosInterceptor";
import Cookies from "js-cookie";

const Donut = () => {
  const [underConsideration, setConsideration] = useState(null);
  const [rejected, setRejected] = useState(null);
  const [pending, setPending] = useState(null);
  const [interviewScheduled, setInterview] = useState(null);
  const jobId = Cookies.get("jobId");

  const [options] = useState({
    labels: ["Under Consideration", "Interview Scheduled", "Pending", "Rejected"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/application/all");
        const filtered = response.data.filter((a) => a.jobid === jobId);
        setConsideration(filtered.filter((a) => a.status === "Under Consideration").length);
        setRejected(filtered.filter((a) => a.status === "Rejected").length);
        setPending(filtered.filter((a) => a.status === "Pending").length);
        setInterview(filtered.filter((a) => a.status === "Interview Scheduled").length);
      } catch (error) {
        console.error("Error fetching application data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <br />
      <Chart
        options={options}
        series={[underConsideration, interviewScheduled, pending, rejected]}
        type="pie"
        width="380"
      />
    </>
  );
};

export default Donut;
