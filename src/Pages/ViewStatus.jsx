import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";

const ViewStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;
  const userId = authUser?.userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/application/all");
        const filteredApplications = response.data.filter(
          (application) => application.userid === userId
        );
        setApplications(filteredApplications);
      } catch (error) {
        console.error("Error fetching application data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <br />
      {myRole === "user" ? (
        <div className="bg-indigo-100 py-10">
          <div className="w-full bg-white shadow-md rounded">
            <h1 className="text-indigo-700 text-3xl items-center text-center">
              Applied Jobs
            </h1>
            <div className="container mx-auto py-10 px-6">
              <table className="border-collapse border border-gray-800 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-800 px-4 py-2">Company Name</th>
                    <th className="border border-gray-800 px-4 py-2">Job Title</th>
                    <th className="border border-gray-800 px-4 py-2">Application Date</th>
                    <th className="border border-gray-800 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-indigo-100" : ""}>
                      <td className="border border-gray-800 px-4 py-2">{application.companyname}</td>
                      <td className="border border-gray-800 px-4 py-2">{application.jobtitle}</td>
                      <td className="border border-gray-800 px-4 py-2">{application.applicationdate}</td>
                      <td
                        className={`border border-gray-800 px-4 py-2 ${
                          application.status === "Pending"
                            ? "text-yellow-600"
                            : application.status === "Under Consideration"
                            ? "text-blue-600"
                            : application.status === "Interview Scheduled"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {application.status} {application.interviewDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <UnauthorizedAccess />
      )}
    </>
  );
};

export default ViewStatus;
