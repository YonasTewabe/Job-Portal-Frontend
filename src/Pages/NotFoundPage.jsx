import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
    <FaExclamationTriangle className="text-yellow-400 text-6xl mb-5" />
    <h1 className="text-5xl font-extrabold text-gray-900 mb-3">404</h1>
    <p className="text-lg text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm">
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
