import axios from "../axiosInterceptor";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Spinner from "../Components/Spinner";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";

const ViewUserList = () => {
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/profile/all");
        setProfiles(response.data.filter((p) => p.role === "user"));
      } catch (error) {
        console.error("Error fetching user list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedProfiles = profiles.slice().sort((a, b) => {
    if (!sortKey) return 0;
    const cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }) =>
    sortKey === col ? (sortOrder === "asc" ? " ▲" : " ▼") : null;

  if (loading) return <Spinner />;

  return (
    <>
      <br />
      {myRole === "admin" ? (
        <div className="bg-indigo-100 py-10">
          <div className="w-full bg-white shadow-md rounded">
            <br />
            <h1 className="text-indigo-700 text-3xl items-center text-center">Registered Users</h1>
            <div className="container mx-auto py-10 px-6">
              {profiles.length > 0 ? (
                <table className="border-collapse border border-gray-800 w-full">
                  <thead>
                    <tr>
                      {["fullname", "age", "sex", "degree", "university", "experience"].map((col) => (
                        <th
                          key={col}
                          className="border border-gray-800 px-4 py-2 cursor-pointer select-none"
                          onClick={() => handleSort(col)}
                        >
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                          <SortIcon col={col} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProfiles.map((profile, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-indigo-100" : ""}>
                        <td className="border border-gray-800 px-4 py-2">{profile.fullname}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.age}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.sex}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.degree}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.university}</td>
                        <td className="border border-gray-800 px-4 py-2">{profile.experience}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="container bg-blue-50 mx-auto py-10 px-6">
                  <p>No registered Users</p>
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

export default ViewUserList;
