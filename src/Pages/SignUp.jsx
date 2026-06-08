import { useState } from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must contain a number, uppercase, lowercase, and special character"
    )
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    try {
      schema.validateSync({ email, password, confirmPassword }, { abortEarly: false });
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
      const { status } = await axios.post("/api/profile/signup", {
        email,
        password,
        role: "user",
      });

      if (status === 409) {
        toast.error("Email already in use");
        return;
      }

      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Email already in use");
      } else {
        toast.error("Failed to sign up. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-2xl text-indigo-700 text-center">Sign Up</p>

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
                autoComplete="new-password"
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

            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mt-6 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`border rounded py-2 px-3 w-full pr-10 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
