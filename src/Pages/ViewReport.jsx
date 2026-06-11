import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "../axiosInterceptor";
import Cookies from "js-cookie";
import Spinner from "../Components/Spinner";

const LABELS = ["Under Consideration", "Interview Scheduled", "Pending", "Rejected"];
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

const Donut = () => {
  const [series,  setSeries]  = useState(null);
  const [loading, setLoading] = useState(true);
  const jobId = Cookies.get("jobId");

  const [options] = useState({
    labels: LABELS,
    colors: COLORS,
    legend: { position: "bottom" },
    plotOptions: { pie: { donut: { size: "65%" } } },
    dataLabels: { enabled: true },
    chart: { animations: { enabled: true } },
  });

  useEffect(() => {
    axios.get(`/api/applications?jobId=${jobId}`)
      .then((r) => {
        const data = Array.isArray(r.data) ? r.data : [];
        setSeries([
          data.filter((a) => a.status === "Under Consideration").length,
          data.filter((a) => a.status === "Interview Scheduled").length,
          data.filter((a) => a.status === "Pending").length,
          data.filter((a) => a.status === "Rejected").length,
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="py-8"><Spinner loading /></div>;
  if (!series || series.every((n) => n === 0))
    return <p className="text-sm text-gray-400 text-center py-4">No application data yet.</p>;

  return (
    <div className="flex justify-center">
      <Chart options={options} series={series} type="donut" width={380} />
    </div>
  );
};

export default Donut;
