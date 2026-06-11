import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { Page, Card, Field, inputCls, Btn } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const schema = Yup.object().shape({
  name:          Yup.string().required("Company name is required"),
  description:   Yup.string().required("Description is required"),
  contactEmail:  Yup.string().email("Invalid email").required("Contact email is required"),
  phone:         Yup.string().required("Phone is required"),
  adminName:     Yup.string().required("Admin name is required"),
  adminEmail:    Yup.string().email("Invalid email").required("Admin email is required"),
  adminPassword: Yup.string()
    .required("Password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
});

const EMPTY = { name: "", description: "", contactEmail: "", phone: "", adminName: "", adminEmail: "", adminPassword: "" };

const AddCompany = () => {
  const { user: authUser } = useAuth();
  const navigate           = useNavigate();

  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  if (authUser?.role !== "superadmin") return <UnauthorizedAccess />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => { fe[e.path] = e.message; });
      setErrors(fe);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/companies", form);
      toast.success("Company created successfully");
      navigate("/superadmin/dashboard");
    } catch (error) {
      if (error.response?.status === 409) toast.error("Admin email already in use");
      else toast.error("Failed to create company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Company</h1>

      <form onSubmit={handleSubmit} noValidate>
        <Card className="mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Company Details</h2>

          <Field label="Company name" htmlFor="name" error={errors.name}>
            <input id="name" type="text" placeholder="Acme Corp"
              value={form.name} onChange={set("name")} className={inputCls(errors.name)} />
          </Field>

          <Field label="Description" htmlFor="description" error={errors.description}>
            <textarea id="description" rows={3} placeholder="What does this company do?"
              value={form.description} onChange={set("description")}
              className={inputCls(errors.description) + " resize-none"} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact email" htmlFor="contactEmail" error={errors.contactEmail}>
              <input id="contactEmail" type="email" placeholder="hr@company.com"
                value={form.contactEmail} onChange={set("contactEmail")} className={inputCls(errors.contactEmail)} />
            </Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone}>
              <input id="phone" type="tel" placeholder="+1-555-000-0000"
                value={form.phone} onChange={set("phone")} className={inputCls(errors.phone)} />
            </Field>
          </div>
        </Card>

        <Card className="mb-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Admin Account</h2>

          <Field label="Admin full name" htmlFor="adminName" error={errors.adminName}>
            <input id="adminName" type="text" placeholder="Jane Smith"
              value={form.adminName} onChange={set("adminName")} className={inputCls(errors.adminName)} />
          </Field>

          <Field label="Admin email" htmlFor="adminEmail" error={errors.adminEmail}>
            <input id="adminEmail" type="email" placeholder="jane@company.com"
              value={form.adminEmail} onChange={set("adminEmail")} className={inputCls(errors.adminEmail)} />
          </Field>

          <Field label="Admin password" htmlFor="adminPassword" error={errors.adminPassword}>
            <div className="relative">
              <input id="adminPassword" type={showPass ? "text" : "password"}
                placeholder="Min 8 chars with upper, lower, number & symbol"
                value={form.adminPassword} onChange={set("adminPassword")}
                className={inputCls(errors.adminPassword) + " pr-10"} />
              <button type="button" onClick={() => setShowPass((v) => !v)}
                aria-label="Toggle password"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
                {showPass ? <BiHide size={18} /> : <BiShow size={18} />}
              </button>
            </div>
          </Field>
        </Card>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className={Btn.primary("flex-1")}>
            {loading ? "Creating…" : "Create Company"}
          </button>
          <button type="button" onClick={() => navigate("/superadmin/dashboard")}
            className={Btn.secondary()}>
            Cancel
          </button>
        </div>
      </form>
    </Page>
  );
};

export default AddCompany;
