import { Link } from "react-router-dom";

const SuspendedAccount = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6">
      <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <h1 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Account Suspended</h1>
    <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
      Your account has been temporarily suspended from posting jobs.
      If you believe this is a mistake, please reach out to us.
    </p>
    <Link
      to="/contact"
      className="btn-primary px-6 py-2.5"
    >
      Contact Support
    </Link>
  </div>
);

export default SuspendedAccount;
