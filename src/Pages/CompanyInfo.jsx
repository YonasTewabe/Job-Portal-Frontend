import { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import * as Yup from "yup";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const schema = Yup.object().shape({
  companyname:        Yup.string().required("Company name is required"),
  companydescription: Yup.string().required("Description is required"),
  contactemail:       Yup.string().email("Invalid email").required("Email is required"),
  companyPhone:       Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const CompanyInfo = () => {
  const user = useLoaderData();
  const [companyname,        setName]  = useState(user.companyname        || "");
  const [companydescription, setDesc]  = useState(user.companydescription || "");
  const [companyPhone,       setPhone] = useState(user.companyPhone       || "");
  const [contactemail,       setEmail] = useState(user.contactemail       || "");
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id }   = useParams();
  const { user: authUser } = useAuth();

  if (authUser?.role !== "hr") return <UnauthorizedAccess />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.validateSync({ companyname, companydescription, contactemail, companyPhone }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => { fe[e.path] = e.message; });
      setErrors(fe);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("companyname",        companyname);
      fd.append("companydescription", companydescription);
      fd.append("companyPhone",       companyPhone);
      fd.append("contactemail",       contactemail);
      await axios.patch(`/api/users/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Company info updated");
      navigate(`/account/${id}`);
    } catch { toast.error("Failed to update. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Company Information" subtitle="Update your company's profile details.">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Company name" htmlFor="companyname" error={errors.companyname}>
          <input id="companyname" type="text" placeholder="Your company name"
            value={companyname} onChange={(e) => setName(e.target.value)} className={inputCls(errors.companyname)} />
        </Field>

        <Field label="Company description" htmlFor="companydescription" error={errors.companydescription}>
          <textarea id="companydescription" rows={4} placeholder="What does your company do?"
            value={companydescription} onChange={(e) => setDesc(e.target.value)}
            className={inputCls(errors.companydescription) + " resize-none"} />
        </Field>

        <Field label="Contact email" htmlFor="contactemail" error={errors.contactemail}>
          <input id="contactemail" type="email" placeholder="contact@company.com"
            value={contactemail} onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.contactemail)} />
        </Field>

        <Field label="Phone number" htmlFor="companyPhone" error={errors.companyPhone}>
          <div className="flex">
            <span className="flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-200
              bg-gray-50 text-sm text-gray-500 font-medium">
              +251
            </span>
            <input id="companyPhone" type="tel" placeholder="9-digit number" maxLength={9}
              value={companyPhone} onChange={(e) => setPhone(e.target.value)}
              className={inputCls(errors.companyPhone) + " rounded-l-none"} />
          </div>
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </FormCard>
  );
};

export default CompanyInfo;
