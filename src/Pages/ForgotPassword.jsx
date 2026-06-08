/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";

const ForgotPassword = () => {
  const [Email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const generatePassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const generatedPassword = generatePassword(9); // Generate a random password

    try {
      await axios.patch(`/api/profile/email/${Email}`, {
        password: generatedPassword,
      });

      toast.success("Reset Email Sent");
      navigate(`/login`);
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
      console.log(error);
    }
  };

  const validateForm = () => {
    const schema = Yup.object().shape({
      Email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    });

    try {
      schema.validateSync(
        { Email },
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
      <div className="flex justify-center items-center h-screen ">
        <div className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-2xl text-indigo-700 text-center">Reset Password</p>
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-8">
            <div className="mb-4">
              <label
                htmlFor="confirmNewPassword"
                className="block text-gray-700 text-sm font-bold mt-6 mb-2"
              >
                Enter your Email Address
              </label>
              <input
                id="Email"
                name="Email"
                type="email"
                value={Email}
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                 Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
