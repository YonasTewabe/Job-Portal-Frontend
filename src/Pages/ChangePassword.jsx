import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "../utils/toast";
import { EyeIcon, EyeOffIcon } from "../Components/icons";
import { useAuth } from "../context/AuthContext";
import axios from "../axiosInterceptor";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const PwdField = ({ id, label, value, onChange, show, onToggle, error }) => (
  <Field label={label} htmlFor={id} error={error}>
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className={inputCls(error) + " pr-10"}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle"
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
      </button>
    </div>
  </Field>
);

const ChangePassword = () => {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const id = authUser?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.validateSync({ currentPassword, newPassword, confirmPassword }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => {
        fe[e.path] = e.message;
      });
      setErrors(fe);
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`/api/users/${id}`, { currentPassword, password: newPassword });
      toast.success("Password changed successfully");
      navigate("/profile");
    } catch (error) {
      const msg = error.response?.data?.message ?? "Failed to change password";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Change Password" subtitle="Choose a strong new password for your account.">
      <form onSubmit={handleSubmit} noValidate>
        <PwdField
          id="currentPassword"
          label="Current password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          error={errors.currentPassword}
        />

        <PwdField
          id="newPassword"
          label="New password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          error={errors.newPassword}
        />

        <PwdField
          id="confirmPassword"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          error={errors.confirmPassword}
        />

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Saving…" : "Change Password"}
        </button>
      </form>
    </FormCard>
  );
};

export default ChangePassword;
