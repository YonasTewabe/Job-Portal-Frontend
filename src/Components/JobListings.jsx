/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "../axiosInterceptor";
import JobListing from "./JobListing";
import Spinner from "./Spinner";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const JobListings = ({ isHome = false }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(isHome ? "desc" : "asc");
  const [sortCriteria, setSortCriteria] = useState("");
  const role = localStorage.getItem("role");
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchJobs = async () => {
      const apiUrl = "/api/jobs";
      try {
        const res = await axios.get(apiUrl);
        setJobs(res.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [isHome]);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Sorting Jobs
  const customSort = (a, b) => {
    switch (sortCriteria) {
      case "deadline":
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      case "type":
        return sortOrder === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      case "title":
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      case "companyName":
        return sortOrder === "asc"
          ? a.companyName.localeCompare(b.companyName)
          : b.companyName.localeCompare(a.companyName);
      default:
        return 0;
    }
  };

  const sortedJobs =
    sortCriteria === "" ? filteredJobs : filteredJobs.sort(customSort);

  const hrJobs =
    role === "hr"
      ? sortedJobs.filter((job) => job.userId.toString() === userId)
      : sortedJobs;

  const displayJobs = isHome ? hrJobs.slice(0, 3) : hrJobs;

  return (
    <>
      <section className="bg-blue-50 px-4 py-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
            {isHome ? "Recent Jobs" : "Browse Jobs"}
          </h2>

          {!isHome && (
            <div className="mb-4 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search jobs"
                className="border p-2 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                className="border p-2 rounded"
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="" disabled>
                  Sort Jobs
                </option>
                <option value="title">Sort by Job Title</option>
                <option value="companyName">Sort by Company Name</option>
                <option value="deadline">Sort by Deadline</option>
                <option value="type">Sort by Job Type</option>
              </select>

              <select
                className="border p-2 rounded"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          )}

          {loading ? (
            <Spinner loading={loading} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayJobs.length > 0 ? (
                displayJobs.map((job) => <JobListing key={job.id} job={job} />)
              ) : (
                <p>No jobs found.</p>
              )}
            </div>
          )}
        </div>
      </section>
      {!isHome && role === "hr" && (
        <section className="m-auto max-w-lg my-10 px-6">
          <Link
            to="/add-job"
            className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
          >
            Add new Job
          </Link>
        </section>
      )}
    </>
  );
};

export default JobListings;
