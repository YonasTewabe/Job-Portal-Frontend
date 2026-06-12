import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { preserveFromPublic } from "../utils/authNavigation";
import { AuthBackHome } from "../Components/ui";
import { toast } from "../utils/toast";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { getDefaultRoute } from "../utils/routes";
import CompanyForm from "../Components/CompanyForm";
import Logo from "../Components/Logo";

const CompanyRegister = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />;
  }

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await axios.post("/api/companies/register", form);
      toast.success("Company registered — please log in with your admin account.");
      navigate("/login", { state: preserveFromPublic(location) });
    } catch (error) {
      if (error.response?.status === 409) toast.error("Admin email already in use");
      else toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <AuthBackHome />
        <div className="flex flex-col items-center mb-8 gap-3 text-center">
          <Logo size={44} variant="color" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Register your company
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Create your company profile and admin account to start posting jobs and hiring.
            </p>
          </div>
        </div>

        <CompanyForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Register company"
        />

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Looking for a job?{" "}
            <Link to="/signup" state={preserveFromPublic(location)} className="link-brand">
              Sign up as a job seeker
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" state={preserveFromPublic(location)} className="link-brand">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
