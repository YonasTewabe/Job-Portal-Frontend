/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import api from "../axiosInterceptor";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Donut from "./ViewReport";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sortCriterion, setSortCriterion] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const jobId = Cookies.get("jobId");
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/application/all");
        const filteredApplicants = response.data.filter(
          (application) => application.jobid === jobId
        );
        setApplicants(filteredApplicants);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, refreshKey]); // Fetch data whenever jobId changes

  const renderCV = (cv) => {
    if (cv) {
      return (
        <div>
          <button
            onClick={() => window.open(`/api/uploads/${cv}`, "_blank")}
            className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
          >
            Download CV
          </button>
        </div>
      );
    } else {
      return <p>No CV uploaded</p>;
    }
  };

  const acceptClick = async (applicant) => {
    try {
      await api.patch(`/api/application/${applicant.id}`, { status: "Under Consideration" });
      const updatedApplicants = applicants.map((app) =>
        app.id === applicant.id ? { ...app, status: "Under Consideration" } : app
      );
      setApplicants(updatedApplicants);
    } catch (error) {
      console.error("Error accepting application:", error);
    }
  };

  const interviewClick = async (applicant) => {
    try {
      await api.patch(`/api/application/${applicant.id}`, {
        status: "Interview Scheduled",
        interviewDate,
        interviewLocation,
      });
      const updatedApplicants = applicants.map((app) =>
        app.id === applicant.id
          ? { ...app, status: "Interview Scheduled" }
          : app
      );
      setApplicants(updatedApplicants);
    } catch (error) {
      console.error("Error scheduling interview:", error);
    }
  };

  const rejectClick = async (applicant) => {
    try {
      await api.patch(`/api/application/${applicant.id}`, { status: "Rejected" });
      const updatedApplicants = applicants.map((app) =>
        app.id === applicant.id ? { ...app, status: "Rejected" } : app
      );
      setApplicants(updatedApplicants);
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Update the refresh key to force a re-mount
  };

  if (loading) {
    return <Spinner />;
  }

  const customSort = (applicants, criterion, isAscending) => {
    const modifier = isAscending ? 1 : -1;
    switch (criterion) {
      case "name":
        return [...applicants].sort((a, b) =>
          modifier * a.fullname.localeCompare(b.fullname)
        );
      case "applicationDate":
        return [...applicants].sort(
          (a, b) =>
            modifier *
            (new Date(a.applicationdate) - new Date(b.applicationdate))
        );
      case "status":
        return [...applicants].sort((a, b) =>
          modifier * a.status.localeCompare(b.status)
        );
      case "education":
        return [...applicants].sort((a, b) =>
          modifier * a.degree.localeCompare(b.degree)
        );
      case "experience":
        return [...applicants].sort((a, b) => modifier * (a.experience - b.experience));
      default:
        return applicants;
    }
  };

  const handleSortChange = (criterion) => {
    if (sortCriterion === criterion) {
      setSortAscending(!sortAscending);
    } else {
      setSortCriterion(criterion);
      setSortAscending(true);
    }
  };

  let sortedApplicants = [...applicants];
  if (sortCriterion) {
    sortedApplicants = customSort(sortedApplicants, sortCriterion, sortAscending);
  }

  return (
    <>
      {myRole === "hr" ? (
        <div className="container mx-auto bg-indigo-100 py-10 px-6">
          <br />
          <h1 className="text-3xl mb-6 text-indigo-700">Applicants </h1>
          <div className="flex justify-end mb-4">
            <select
              id="sortCriterion"
              className="p-2 border rounded"
              value={sortCriterion}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="" disabled>
                Sort Applicants
              </option>
              <option value="name">Applicant Name</option>
              <option value="applicationDate">Application Date</option>
              <option value="education">Education</option>
              <option value="experience">Experience</option>
              <option value="status">Status</option>
            </select>
            <select
              id="sortOrder"
              className="p-2 border rounded"
              value={sortAscending ? "asc" : "desc"}
              onChange={() => setSortAscending((prev) => !prev)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          {sortedApplicants.length === 0 ? (
            <p>No applicants yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {sortedApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
                >
                  <h3 className="text-xl font-bold">Name:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.fullname}
                  </p>
                  <h3 className="text-xl font-bold">Education:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.degree}
                  </p>

                  <h3 className="text-xl font-bold">University:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.university}
                  </p>

                  <h3 className="text-xl font-bold">Experience:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.experience}
                  </p>

                  <h3 className="text-xl font-bold">Email Address:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.contactemail}
                  </p>

                  <h3 className="text-xl font-bold">Phone Number:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    +251 {applicant.userphone}
                  </p>

                  <h3 className="text-xl font-bold">CV:</h3>
                  {renderCV(applicant.cv)}

                  <h3 className="text-xl font-bold">Applied On:</h3>
                  <p className="my-2 bg-indigo-100 p-2 font-bold">
                    {applicant.applicationdate}
                  </p>
                  <div className="flex justify-center items-center mt-4">
                    {applicant.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                          onClick={() => acceptClick(applicant)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                          onClick={() => rejectClick(applicant)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <p className="text-xl font-bold">Status: {applicant.status}</p>
                    )}
                  </div>
                  {applicant.status === "Under Consideration" && (
                    <div>
                      <label
                        htmlFor="interviewDate"
                        className="block text-gray-700 text-sm font-bold mt-6 mb-2"
                      >
                        Interview Date
                      </label>
                      <input
                        id="interviewDate"
                        name="interviewDate"
                        type="date"
                        className="border rounded py-2 px-3 w-full"
                        value={interviewDate}
                        required
                        onChange={(e) => setInterviewDate(e.target.value)}
                      />
                      <label
                        htmlFor="interviewLocation"
                        className="block text-gray-700 text-sm font-bold mt-6 mb-2"
                      >
                        Interview Location
                      </label>
                      <input
                        id="interviewLocation"
                        name="interviewLocation"
                        type="text"
                        placeholder="Interview Location"
                        value={interviewLocation}
                        required
                        onChange={(e) => setInterviewLocation(e.target.value)}
                        className="border rounded py-2 px-3 w-full"
                      />
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => interviewClick(applicant)}
                      >
                        Schedule Interview
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <br />
          <h1 className="text-3xl mb-6 text-indigo-700">Summary</h1>
          <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
            <Donut key={refreshKey} />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleRefresh}
            >
              Refresh Summary
            </button>
          </div>
        </div>
      ) : (
        <UnauthorizedAccess />
      )}
    </>
  );
};

export default ViewApplicants;
