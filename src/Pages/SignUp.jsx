import { useState } from "react";
import * as Yup from "yup";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { preserveAuthRedirect, resolvePostAuthPath } from "../utils/authNavigation";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import { AuthCard, Field, inputCls, Btn } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
  confirmPassword: Yup.string().required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const PasswordInput = ({ id, label, value, onChange, show, onToggle, error, autoComplete }) => (
  <Field label={label} htmlFor={id} error={error}>
    <div className="relative">
      <input
        id={id} name={id} type={show ? "text" : "password"}
        autoComplete={autoComplete} placeholder="••••••••"
        value={value} onChange={onChange}
        className={inputCls(error) + " pr-10"}
      />
      <button type="button" aria-label="Toggle password" onClick={onToggle}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
        {show ? <BiHide size={18} /> : <BiShow size={18} />}
      </button>
    </div>
  </Field>
);

const SignUp = () => {
  const [name, setName]                       = useState("");
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [errors, setErrors]                   = useState({});
  const [loading, setLoading]                 = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  if (user) {
    return <Navigate to={resolvePostAuthPath(location, user.role)} replace />;
  }

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
      await axios.post("/api/auth/signup", { name: name.trim(), email, password, role: "user" });
      toast.success("Account created — please log in.");
      navigate("/login", { state: preserveAuthRedirect(location) });
    } catch (error) {
      if (error.response?.status === 409) toast.error("Email already in use");
      else toast.error("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create an account" subtitle="Start tracking your job applications today">
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input
            id="name" type="text" autoComplete="name" placeholder="Jane Smith"
            value={name} onChange={(e) => setName(e.target.value)}
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)}
          />
        </Field>

        <PasswordInput
          id="password" label="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          show={showPassword} onToggle={() => setShowPassword((v) => !v)}
          error={errors.password} autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword" label="Confirm password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          show={showConfirm} onToggle={() => setShowConfirm((v) => !v)}
          error={errors.confirmPassword} autoComplete="new-password"
        />

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
        <p className="text-sm text-gray-500">
          Hiring talent?{" "}
          <Link to="/register/company" state={preserveAuthRedirect(location)} className="link-brand">
            Register your company
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" state={preserveAuthRedirect(location)} className="link-brand">Sign in</Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default SignUp;
