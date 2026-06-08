import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect away from the login page
  if (user) {
    const destination = location.state?.from?.pathname ?? "/";
    navigate(destination, { replace: true });
  }

  const validate = () => {
    try {
      schema.validateSync({ email, password }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => { fieldErrors[e.path] = e.message; });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/profile/login", { email, password });
      login(data);
      navigateAfterLogin(data);
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const navigateAfterLogin = (data) => {
    if (data.usercompleted || data.hrcompleted || data.role === "admin") {
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } else if (data.role === "user") {
      navigate(`/UpdateUser/${data.profileId}`, { replace: true });
    } else if (data.role === "hr") {
      navigate(`/CompanyInfo/${data.profileId}`, { replace: true });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-2xl text-indigo-700 text-center">Login</p>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8" noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mt-6 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border rounded py-2 px-3 w-full pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <div className="text-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? "Logging in…" : "Login"}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4 flex justify-between">
          <Link to="/forgotpassword" className="text-sm text-blue-500">
            Forgot Password?
          </Link>
          <span className="text-sm">
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
