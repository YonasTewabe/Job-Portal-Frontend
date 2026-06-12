import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50">
    <div className="mb-8">
      <p className="text-8xl font-extrabold text-brand-600 tracking-tight leading-none">404</p>
      <div className="h-1 w-16 bg-brand-200 rounded-full mx-auto mt-3" />
    </div>
    <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Page not found</h1>
    <p className="text-sm text-gray-500 mb-10 max-w-xs leading-relaxed">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary px-6 py-3">
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
