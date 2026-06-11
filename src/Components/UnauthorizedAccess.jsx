import { Link, useNavigate } from "react-router-dom";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Access Denied</h1>
      <p className="text-sm text-gray-500 max-w-xs mb-8 leading-relaxed">
        You don't have permission to view this page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold
            px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="btn-primary bg-brand-600 hover:bg-brand-700 text-white font-semibold
            px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
