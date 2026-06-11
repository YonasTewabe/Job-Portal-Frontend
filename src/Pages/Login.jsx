import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import * as Yup from "yup";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
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

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

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
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back">
      <form onSubmit={handleSubmit} noValidate className="space-y-1">
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)} />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className={inputCls(errors.password) + " pr-10"} />
            <button type="button" aria-label="Toggle password"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showPassword ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <div className="flex justify-end mb-4">
          <Link to="/forgotpassword" className="text-xs text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className={Btn.full("primary")}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        No account?{" "}
        <Link to="/signup" className="text-blue-600 font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
};

export default Login;
