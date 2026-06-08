/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { useAuth } from "../context/AuthContext";
import axios from "../axiosInterceptor";

const AddHr = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      await axios.post("/api/profile/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        email,
        password,
        role: "hr",
      });
      toast.success("Successfully added new HR.");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already in use");
      } else {
        toast.error("Failed to add. Please try again later.");
      }
      console.error(error);
    }
  };

  const validateForm = () => {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          passwordRegex,
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character"
        )
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .oneOf([password], "Passwords must match")
        .required("Confirm Password is required"),
    });

    try {
      schema.validateSync(
        { email, password, confirmPassword },
        { abortEarly: false }
      );
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  return (
    <>
      {myRole === "admin" ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <div className="text-red-500 text-sm">{errors.email}</div>
                )}

                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mt-6 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`border rounded py-2 px-3 w-full ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm">{errors.password}</div>
                )}

                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 text-sm font-bold mt-6 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border rounded py-2 px-3 w-full ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <UnauthorizedAccess />

      )}
    </>
  );
};

export default AddHr;
