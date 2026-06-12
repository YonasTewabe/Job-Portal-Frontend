import { useState } from "react";
import * as Yup from "yup";
import { EyeIcon, EyeOffIcon } from "./icons";
import { Card, Field, inputCls, Btn } from "./ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

export const companyFormSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  description: Yup.string().required("Description is required"),
  contactEmail: Yup.string().email("Invalid email").required("Contact email is required"),
  phone: Yup.string().required("Phone is required"),
  adminName: Yup.string().required("Admin name is required"),
  adminEmail: Yup.string().email("Invalid email").required("Admin email is required"),
  adminPassword: Yup.string()
    .required("Password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
});

export const EMPTY_COMPANY_FORM = {
  name: "",
  description: "",
  contactEmail: "",
  phone: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

const CompanyForm = ({
  onSubmit,
  loading = false,
  submitLabel = "Create Company",
  cancelLabel,
  onCancel,
}) => {
  const [form, setForm] = useState(EMPTY_COMPANY_FORM);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await companyFormSchema.validate(form, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((item) => {
        fe[item.path] = item.message;
      });
      setErrors(fe);
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 items-start">
        {/* Column 1 — Company details */}
        <Card>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            Company Details
          </h2>

          <Field label="Company name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              type="text"
              placeholder="Acme Corp"
              value={form.name}
              onChange={set("name")}
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="Description" htmlFor="description" error={errors.description}>
            <textarea
              id="description"
              rows={4}
              placeholder="What does your company do?"
              value={form.description}
              onChange={set("description")}
              className={inputCls(errors.description) + " resize-none"}
            />
          </Field>

          <Field label="Contact email" htmlFor="contactEmail" error={errors.contactEmail}>
            <input
              id="contactEmail"
              type="email"
              placeholder="hr@company.com"
              value={form.contactEmail}
              onChange={set("contactEmail")}
              className={inputCls(errors.contactEmail)}
            />
          </Field>

          <Field label="Phone" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              type="tel"
              placeholder="+1-555-000-0000"
              value={form.phone}
              onChange={set("phone")}
              className={inputCls(errors.phone)}
            />
          </Field>
        </Card>

        {/* Column 2 — Admin account */}
        <Card>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Admin Account
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            This person will manage job postings and applicants for your company.
          </p>

          <Field label="Admin full name" htmlFor="adminName" error={errors.adminName}>
            <input
              id="adminName"
              type="text"
              placeholder="Jane Smith"
              value={form.adminName}
              onChange={set("adminName")}
              className={inputCls(errors.adminName)}
            />
          </Field>

          <Field label="Admin email" htmlFor="adminEmail" error={errors.adminEmail}>
            <input
              id="adminEmail"
              type="email"
              placeholder="jane@company.com"
              value={form.adminEmail}
              onChange={set("adminEmail")}
              className={inputCls(errors.adminEmail)}
            />
          </Field>

          <Field
            label="Admin password"
            htmlFor="adminPassword"
            error={errors.adminPassword}
            hint="Min 8 chars with upper, lower, number & symbol"
          >
            <div className="relative">
              <input
                id="adminPassword"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.adminPassword}
                onChange={set("adminPassword")}
                className={inputCls(errors.adminPassword) + " pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </Field>
        </Card>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className={Btn.primary("flex-1 py-3")}>
          {loading ? "Creating…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={Btn.secondary()}>
            {cancelLabel ?? "Cancel"}
          </button>
        )}
      </div>
    </form>
  );
};

export default CompanyForm;
