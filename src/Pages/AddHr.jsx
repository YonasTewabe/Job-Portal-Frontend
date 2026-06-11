import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { useAuth } from "../context/AuthContext";
import axios from "../axiosInterceptor";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  email:           Yup.string().email("Invalid email").required("Email is required"),
  password:        Yup.string().required("Password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
  confirmPassword: Yup.string().required("Please confirm the password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const AddHr = () => {
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const navigate = useNavigate();

  const { user: authUser } = useAuth();
  const myRole = authUser?.role;

  if (myRole !== "superadmin") return <UnauthorizedAccess />;

  const validate = () => {
    try {
      schema.validateSync({ email, password, confirmPassword }, { abortEarly: false });
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
        email,
        password,
        name: email.split("@")[0],
        role: "company_admin",
      });
      toast.success("Company admin account created.");
      navigate("/superadmin/dashboard");
    } catch (error) {
      if (error.response?.status === 409) toast.error("Email already in use");
      else toast.error("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Add Company Admin" subtitle="Create a new admin account for a company.">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="off" placeholder="admin@company.com"
            value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}
          hint="Min 8 chars with upper, lower, number & symbol">
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className={inputCls(errors.password) + " pr-10"} />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showPassword ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <div className="relative">
            <input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls(errors.confirmPassword) + " pr-10"} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
              {showConfirm ? <BiHide size={18} /> : <BiShow size={18} />}
            </button>
          </div>
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </FormCard>
  );
};

export default AddHr;
