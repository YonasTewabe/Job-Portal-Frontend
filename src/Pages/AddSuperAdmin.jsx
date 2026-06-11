import { useState } from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import NotFoundPage from "./NotFoundPage";
import { useAuth } from "../context/AuthContext";
import axios from "../axiosInterceptor";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  name:            Yup.string().required("Name is required"),
  email:           Yup.string().email("Invalid email").required("Email is required"),
  password:        Yup.string().required("Password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
  confirmPassword: Yup.string().required("Please confirm the password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const AddSuperAdmin = () => {
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  if (authUser?.role !== "superadmin") return <NotFoundPage />;

  const validate = () => {
    try {
      schema.validateSync({ name, email, password, confirmPassword }, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => { fe[e.path] = e.message; });
      setErrors(fe);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("/api/users", {
        name,
        email,
        password,
        role: "superadmin",
      });
      toast.success("Super admin account created.");
      navigate("/superadmin/admins");
    } catch (error) {
      if (error.response?.status === 409) toast.error("Email already in use");
      else toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Add Super Admin" subtitle="Create another platform super admin account.">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="admin@platform.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}
          hint="Min 8 chars with upper, lower, number & symbol">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls(errors.password) + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls(errors.confirmPassword) + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Creating…" : "Create Super Admin"}
        </button>

        <Link to="/superadmin/admins" className={Btn.ghost("w-full mt-3 py-2.5 text-center block")}>
          Cancel
        </Link>
      </form>
    </FormCard>
  );
};

export default AddSuperAdmin;
