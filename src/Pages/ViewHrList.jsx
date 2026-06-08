import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";

const ViewHrList = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesResponse, jobsResponse] = await Promise.all([
          axios.get("/api/profile/all"),
          axios.get("/api/jobs"),
        ]);

        const profilesData = profilesResponse.data;
        const jobsData = jobsResponse.data;

        const filteredProfiles = profilesData.filter((p) => p.role === "hr");

        for (let profile of filteredProfiles) {
          profile.jobsPosted = jobsData.filter(
            (job) => job.companyName === profile.companyname
          ).length;
          profile.hrStatus = await fetchHrStatus(profile.id);
        }

        setProfiles(filteredProfiles);
      } catch (error) {
        console.error("Error fetching HR list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchHrStatus = async (id) => {
    try {
      const response = await axios.get(`/api/profile/${id}`);
      return response.data.status;
    } catch {
      return "false";
    }
  };

  const toggleHrStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "false" ? "true" : "false";
    try {
      await axios.patch(`/api/profile/${id}`, { hrStatus: newStatus });
      setProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, hrStatus: newStatus } : p))
      );
    } catch (error) {
      console.error("Error updating HR status:", error);
    }
  };

  const StatusButton = (hrStatus, id) => (
    <button
      className={`${hrStatus === "true" ? "bg-red-500" : "bg-green-500"} py-2 px-4 rounded-full`}
      onClick={() => toggleHrStatus(id, hrStatus)}
    >
      {hrStatus === "true" ? "Suspend" : "Activate"}
    </button>
  );

  if (loading) return <Spinner />;

  return (
    <>
      <br />
      {myRole === "admin" ? (
        <div className="bg-indigo-100 py-10">
          <div className="w-full bg-white shadow-md rounded">
            <br />
            <h1 className="text-indigo-700 text-3xl items-center text-center">Registered HR</h1>
            <div className="container mx-auto py-10 px-6">
              {profiles.length > 0 ? (
                <table className="border-collapse border border-gray-800 w-full">
                  <thead>
                    <tr>
                      <th className="border border-gray-800 px-4 py-2">Company Name</th>
                      <th className="border border-gray-800 px-4 py-2">Email</th>
                      <th className="border border-gray-800 px-4 py-2">Jobs Posted</th>
                      <th className="border border-gray-800 px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-indigo-100" : ""}>
                        <td className="border border-gray-800 px-4 py-2">{profile.companyname}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.email}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.jobsPosted}</td>
                        <td className="border border-gray-800 px-4 py-2">
                          {StatusButton(profile.hrStatus, profile.id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="container bg-blue-50 mx-auto py-10 px-6">
                  <p>No registered HR</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <UnauthorizedAccess />
      )}
    </>
  );
};

export default ViewHrList;
