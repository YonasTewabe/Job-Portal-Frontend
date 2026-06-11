import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { AuthCard, Field, inputCls, Btn } from "../Components/ui";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ForgotPassword = () => {
  const [email, setEmail]     = useState("");
  const [errors, setErrors]   = useState({});
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
      toast.info("Please contact support to reset your password.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll help you get back in."
    >
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email address" htmlFor="email" error={errors.email}>
          <input
            id="email" type="email" autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className={inputCls(errors.email)}
          />
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-1 py-3")}>
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <Link to="/login" className="text-sm link-brand">
          ← Back to login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
