import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { preserveAuthRedirect, resolvePostAuthPath } from "../utils/authNavigation";
import { AuthCard, Field, inputCls, Btn } from "../Components/ui";

const schema = Yup.object().shape({
  email:    Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(8, "Minimum 8 characters"),
});

const Login = () => {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const { user, login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  if (user) {
    return <Navigate to={resolvePostAuthPath(location, user.role)} replace />;
  }

  const validate = () => {
    try {
      schema.validateSync({ email, password }, { abortEarly: false });
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
      const { data } = await axios.post("/api/auth/login", { email, password });
      login(data);
      navigate(resolvePostAuthPath(location, data.role), { replace: true });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input
              id="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className={inputCls(errors.password) + " pr-10"}
            />
            <button
              type="button" aria-label="Toggle password"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <div className="flex justify-end mb-2">
          <Link to="/forgotpassword" className="text-xs link-brand">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-1 py-3")}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
        <p className="text-sm text-gray-500">
          No account?{" "}
          <Link to="/signup" state={preserveAuthRedirect(location)} className="link-brand">
            Sign up as job seeker
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          Hiring?{" "}
          <Link to="/register/company" state={preserveAuthRedirect(location)} className="link-brand">
            Register your company
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default Login;
