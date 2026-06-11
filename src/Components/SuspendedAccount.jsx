import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const SuspendedAccount = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-5">
      <FaExclamationTriangle className="text-yellow-500 text-3xl" />
    </div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>
    <p className="text-sm text-gray-500 max-w-sm mb-6">
      Your account has been temporarily suspended from posting jobs.
      If you believe this is a mistake, please reach out to us.
    </p>
    <Link to="/contact"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">
      Contact Support
    </Link>
  </div>
);

export default SuspendedAccount;
