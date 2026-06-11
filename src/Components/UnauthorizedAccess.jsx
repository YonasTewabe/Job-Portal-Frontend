import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
        <FaLock className="text-red-500 text-2xl" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        You don't have permission to view this page.
      </p>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-lg text-sm transition">
          Go Back
        </button>
        <Link to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">
          Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
