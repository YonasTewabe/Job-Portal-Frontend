import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AuthCard, Field, inputCls, Btn } from "../Components/ui";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
  const [email, setEmail]   = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.validateSync({ email }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => { fe[e.path] = e.message; });
      setErrors(fe);
      return;
    }

    setLoading(true);
    try {
      // No dedicated forgot-password endpoint in the current API.
      // Show guidance to contact support.
      toast.info("Please contact support to reset your password.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset your password">
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter your email and we'll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email address" htmlFor="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)} />
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2")}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link to="/login" className="text-blue-600 hover:underline">← Back to login</Link>
      </p>
    </AuthCard>
  );
};

export default ForgotPassword;
