/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import axios from "../axiosInterceptor";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { user: authUser } = useAuth();
  const id = authUser?.userId;

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.patch(`/api/profile/${id}`, {
        password: Password,
      });

      if (response.status !== 200) {
        throw new Error("Failed to update information");
      }

      toast.success("Password changed Successfully");
      navigate(`/account/${id}`);
    } catch (error) {
      toast.error("Failed to update information. Please try again.");
      console.log(error.message);
    }

    setCurrentPassword("");
    setPassword("");
    setConfirmNewPassword("");
  };

  const validateForm = () => {
    const schema = Yup.object().shape({
      currentPassword: Yup.string().required("Current password is required"),
      Password: Yup.string()
        .required("New password is required")
        .matches(
          passwordRegex,
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character"
        )
        .min(8, "Password must be at least 8 characters"),
      confirmNewPassword: Yup.string()
        .required("Confirm new password is required")
        .oneOf([Yup.ref("Password"), null], "Passwords must match"),
    });

    try {
      schema.validateSync(
        { currentPassword, Password, confirmNewPassword },
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
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="text-2xl text-indigo-700 text-center">Change Password</p>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8">
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`border rounded py-2 px-3 w-full ${
                  errors.currentPassword ? "border-red-500" : ""
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
            {errors.currentPassword && (
              <div className="text-red-500 text-sm">
                {errors.currentPassword}
              </div>
            )}

            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-sm font-bold mt-6 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className={`border rounded py-2 px-3 w-full ${
                  errors.newPassword ? "border-red-500" : ""
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
            {errors.newPassword && (
              <div className="text-red-500 text-sm">{errors.newPassword}</div>
            )}

            <label
              htmlFor="confirmNewPassword"
              className="block text-gray-700 text-sm font-bold mt-6 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`border rounded py-2 px-3 w-full ${
                  errors.confirmNewPassword ? "border-red-500" : ""
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
            {errors.confirmNewPassword && (
              <div className="text-red-500 text-sm">
                {errors.confirmNewPassword}
              </div>
            )}

            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
