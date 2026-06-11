import { useEffect, useState } from "react";
import * as Yup from "yup";
import { BiShow, BiHide } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { patchSession } from "../utils/session";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Field, inputCls, Btn, Divider } from "../Components/ui";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const userSchema = Yup.object().shape({
  fullname:   Yup.string().matches(/^[A-Za-z ]*$/, "Letters only").required("Required"),
  age:        Yup.number().typeError("Must be a number").required("Required").positive().integer(),
  sex:        Yup.string().oneOf(["Male", "Female"], "Select one").required("Required"),
  degree:     Yup.string().required("Required"),
  university: Yup.string().required("Required"),
  experience: Yup.string().required("Required"),
  userPhone:  Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const hrSchema = Yup.object().shape({
  companyname:        Yup.string().required("Company name is required"),
  companydescription: Yup.string().required("Description is required"),
  contactemail:       Yup.string().email("Invalid email").required("Email is required"),
  companyPhone:       Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const companyProfileSchema = Yup.object().shape({
  coName:         Yup.string().required("Company name is required"),
  coDescription:  Yup.string().required("Description is required"),
  coContactEmail: Yup.string().email("Invalid email").required("Email is required"),
  coPhone:        Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const adminNameSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required").min(2, "At least 2 characters"),
});

const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword:     Yup.string().required("New password is required")
    .matches(passwordRegex, "Must include upper, lower, number & special char")
    .min(8, "At least 8 characters"),
  confirmPassword: Yup.string().required("Please confirm your password")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

const PwdField = ({ id, label, value, onChange, show, onToggle, error }) => (
  <Field label={label} htmlFor={id} error={error}>
    <div className="relative">
      <input
        id={id} type={show ? "text" : "password"} placeholder="••••••••"
        value={value} onChange={onChange} className={inputCls(error) + " pr-10"}
      />
      <button type="button" onClick={onToggle} aria-label="Toggle password visibility"
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">
        {show ? <BiHide size={18} /> : <BiShow size={18} />}
      </button>
    </div>
  </Field>
);

const PhoneInput = ({ id, value, onChange, error }) => (
  <Field label="Phone number" htmlFor={id} error={error}>
    <div className="flex">
      <span className="flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-200
        bg-gray-50 text-sm text-gray-500 font-medium">
        +251
      </span>
      <input
        id={id} type="tel" placeholder="9-digit number" maxLength={9}
        value={value} onChange={onChange}
        className={inputCls(error) + " rounded-l-none"}
      />
    </div>
  </Field>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
      ${active
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-500 hover:text-gray-700"}`}
  >
    {children}
  </button>
);

const MyProfile = () => {
  const { user: authUser, refreshSession } = useAuth();
  const role = authUser?.role;
  const userId = authUser?.userId;

  const [tab, setTab]           = useState("profile");
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState({});

  // Job seeker
  const [fullname, setFullname]       = useState("");
  const [age, setAge]                 = useState("");
  const [sex, setSex]                 = useState("");
  const [degree, setDegree]           = useState("");
  const [university, setUniversity]   = useState("");
  const [experience, setExperience]   = useState("None");
  const [userPhone, setUserPhone]     = useState("");
  const [cv, setCv]                   = useState(null);
  const [email, setEmail]             = useState("");

  // HR (legacy user-embedded company fields)
  const [companyname, setCompanyname]             = useState("");
  const [companydescription, setCompanydescription] = useState("");
  const [contactemail, setContactemail]           = useState("");
  const [companyPhone, setCompanyPhone]           = useState("");

  // Company admin
  const [name, setName]               = useState("");
  const [companyId, setCompanyId]     = useState(null);
  const [coName, setCoName]           = useState("");
  const [coDescription, setCoDescription] = useState("");
  const [coContactEmail, setCoContactEmail] = useState("");
  const [coPhone, setCoPhone]         = useState("");

  // Password tab
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);

  useEffect(() => {
    if (!authUser) return;

    const load = async () => {
      setLoading(true);
      try {
        if (role === "user") {
          const { data } = await axios.get("/api/applicants/me");
          setFullname(data.fullname ?? "");
          setAge(data.age ?? "");
          setSex(data.sex ?? "");
          setDegree(data.degree ?? "");
          setUniversity(data.university ?? "");
          setExperience(data.experience ?? "None");
          setUserPhone(data.userPhone ?? data.userphone ?? "");
          setEmail(data.contactemail ?? data.email ?? "");
        } else if (role === "company_admin") {
          const [userRes, companyRes] = await Promise.all([
            axios.get(`/api/users/${userId}`),
            axios.get("/api/companies/mine"),
          ]);
          const userData = userRes.data;
          const company = companyRes.data;
          setName(userData.name ?? authUser.name ?? "");
          setEmail(userData.email ?? "");
          setCompanyId(company.id);
          setCoName(company.name ?? "");
          setCoDescription(company.description ?? "");
          setCoContactEmail(company.contactEmail ?? "");
          setCoPhone(company.phone ?? "");
        } else {
          const { data } = await axios.get(`/api/users/${userId}`);
          setName(data.name ?? authUser.name ?? "");
          setEmail(data.email ?? "");
          if (role === "hr") {
            setCompanyname(data.companyname ?? "");
            setCompanydescription(data.companydescription ?? "");
            setContactemail(data.contactemail ?? "");
            setCompanyPhone(data.companyPhone ?? "");
          }
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authUser, role, userId]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (role === "user") {
        userSchema.validateSync(
          { fullname, age, sex, degree, university, experience, userPhone },
          { abortEarly: false }
        );
      } else if (role === "hr") {
        hrSchema.validateSync({ companyname, companydescription, contactemail, companyPhone }, { abortEarly: false });
      } else if (role === "company_admin") {
        adminNameSchema.validateSync({ name }, { abortEarly: false });
        companyProfileSchema.validateSync(
          { coName, coDescription, coContactEmail, coPhone },
          { abortEarly: false }
        );
      } else {
        adminNameSchema.validateSync({ name }, { abortEarly: false });
      }
    } catch (err) {
      const fe = {};
      err.inner.forEach((item) => { fe[item.path] = item.message; });
      setErrors(fe);
      return;
    }

    setSaving(true);
    try {
      if (role === "user") {
        await axios.patch("/api/applicants/me", {
          fullname, age, sex, degree, university, experience, userPhone,
        });
        if (cv) {
          const fd = new FormData();
          fd.append("file", cv);
          await axios.post("/api/applicants/me/cv", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        patchSession({ name: fullname });
      } else if (role === "hr") {
        const fd = new FormData();
        fd.append("companyname", companyname);
        fd.append("companydescription", companydescription);
        fd.append("companyPhone", companyPhone);
        fd.append("contactemail", contactemail);
        await axios.patch(`/api/users/${userId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (role === "company_admin") {
        if (!companyId) {
          toast.error("Company not found");
          return;
        }
        await axios.patch(`/api/users/${userId}`, { name });
        await axios.patch(`/api/companies/${companyId}`, {
          name: coName,
          description: coDescription,
          contactEmail: coContactEmail,
          phone: coPhone,
        });
        patchSession({ name });
      } else {
        await axios.patch(`/api/users/${userId}`, { name });
        patchSession({ name });
      }
      refreshSession();
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      passwordSchema.validateSync({ currentPassword, newPassword, confirmPassword }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((item) => { fe[item.path] = item.message; });
      setErrors(fe);
      return;
    }

    setSaving(true);
    try {
      await axios.patch(`/api/users/${userId}`, { currentPassword, password: newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = {
    user:          "Job Seeker",
    company_admin: "Company Admin",
    hr:            "HR",
    superadmin:    "Super Admin",
    admin:         "Admin",
  }[role] ?? role;

  if (loading) return <div className="py-24"><Spinner loading /></div>;

  return (
    <Page className="max-w-2xl">
      <div className="mb-8">
        <PageTitle>My Profile</PageTitle>
        <p className="text-sm text-gray-500 mt-1">{roleLabel} account</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        <TabButton active={tab === "profile"} onClick={() => { setTab("profile"); setErrors({}); }}>
          Profile
        </TabButton>
        <TabButton active={tab === "password"} onClick={() => { setTab("password"); setErrors({}); }}>
          Change Password
        </TabButton>
      </div>

      <Card>
        {tab === "profile" ? (
          <form onSubmit={handleProfileSubmit} noValidate>
            {role === "user" && (
              <>
                <Field label="Email" htmlFor="email">
                  <input id="email" type="email" value={email} disabled className={inputCls() + " bg-gray-50"} />
                </Field>
                <Field label="Full name" htmlFor="fullname" error={errors.fullname}>
                  <input id="fullname" type="text" value={fullname}
                    onChange={(e) => setFullname(e.target.value)} className={inputCls(errors.fullname)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Age" htmlFor="age" error={errors.age}>
                    <input id="age" type="text" value={age} maxLength={2}
                      onChange={(e) => setAge(e.target.value)} className={inputCls(errors.age)} />
                  </Field>
                  <Field label="Sex" error={errors.sex}>
                    <div className="flex gap-4 mt-1">
                      {["Male", "Female"].map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                          <input type="radio" name="sex" value={s} checked={sex === s}
                            onChange={(e) => setSex(e.target.value)} className="accent-brand-600 w-4 h-4" />
                          {s}
                        </label>
                      ))}
                    </div>
                    {errors.sex && <p className="mt-1.5 text-xs text-red-500">{errors.sex}</p>}
                  </Field>
                </div>
                <Field label="Degree" htmlFor="degree" error={errors.degree}>
                  <input id="degree" type="text" value={degree}
                    onChange={(e) => setDegree(e.target.value)} className={inputCls(errors.degree)} />
                </Field>
                <Field label="University" htmlFor="university" error={errors.university}>
                  <input id="university" type="text" value={university}
                    onChange={(e) => setUniversity(e.target.value)} className={inputCls(errors.university)} />
                </Field>
                <Field label="Experience" htmlFor="experience" error={errors.experience}>
                  <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value)}
                    className={inputCls(errors.experience)}>
                    {["None", "Less than 1 Year", "1 - 3 years", "3 - 5 years", "5+ years"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <PhoneInput id="userPhone" value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)} error={errors.userPhone} />
                <Field label="CV (PDF)" htmlFor="cv">
                  <input id="cv" type="file" accept="application/pdf"
                    onChange={(e) => setCv(e.target.files[0])}
                    className="block w-full text-sm text-gray-500
                      file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                      file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700
                      hover:file:bg-brand-100 transition-all" />
                </Field>
              </>
            )}

            {role === "hr" && (
              <>
                <Field label="Company name" htmlFor="companyname" error={errors.companyname}>
                  <input id="companyname" type="text" value={companyname}
                    onChange={(e) => setCompanyname(e.target.value)} className={inputCls(errors.companyname)} />
                </Field>
                <Field label="Company description" htmlFor="companydescription" error={errors.companydescription}>
                  <textarea id="companydescription" rows={4} value={companydescription}
                    onChange={(e) => setCompanydescription(e.target.value)}
                    className={inputCls(errors.companydescription) + " resize-none"} />
                </Field>
                <Field label="Contact email" htmlFor="contactemail" error={errors.contactemail}>
                  <input id="contactemail" type="email" value={contactemail}
                    onChange={(e) => setContactemail(e.target.value)} className={inputCls(errors.contactemail)} />
                </Field>
                <PhoneInput id="companyPhone" value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)} error={errors.companyPhone} />
              </>
            )}

            {role === "company_admin" && (
              <>
                <Field label="Your name" htmlFor="name" error={errors.name}>
                  <input id="name" type="text" value={name}
                    onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
                </Field>
                <Field label="Login email" htmlFor="email">
                  <input id="email" type="email" value={email} disabled className={inputCls() + " bg-gray-50"} />
                </Field>
                <Divider label="Company" />
                <Field label="Company name" htmlFor="coName" error={errors.coName}>
                  <input id="coName" type="text" value={coName}
                    onChange={(e) => setCoName(e.target.value)} className={inputCls(errors.coName)} />
                </Field>
                <Field label="Description" htmlFor="coDescription" error={errors.coDescription}>
                  <textarea id="coDescription" rows={4} value={coDescription}
                    onChange={(e) => setCoDescription(e.target.value)}
                    className={inputCls(errors.coDescription) + " resize-none"} />
                </Field>
                <Field label="Contact email" htmlFor="coContactEmail" error={errors.coContactEmail}>
                  <input id="coContactEmail" type="email" value={coContactEmail}
                    onChange={(e) => setCoContactEmail(e.target.value)} className={inputCls(errors.coContactEmail)} />
                </Field>
                <PhoneInput id="coPhone" value={coPhone}
                  onChange={(e) => setCoPhone(e.target.value)} error={errors.coPhone} />
              </>
            )}

            {(role === "superadmin" || role === "admin") && (
              <>
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <input id="name" type="text" value={name}
                    onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input id="email" type="email" value={email} disabled className={inputCls() + " bg-gray-50"} />
                </Field>
              </>
            )}

            <button type="submit" disabled={saving} className={Btn.full("primary", "mt-2 py-3")}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <p className="text-sm text-gray-500 mb-6">
              Choose a strong password with upper and lower case letters, a number, and a special character.
            </p>
            <PwdField id="currentPassword" label="Current password"
              value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} error={errors.currentPassword} />
            <PwdField id="newPassword" label="New password"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              show={showNew} onToggle={() => setShowNew((v) => !v)} error={errors.newPassword} />
            <PwdField id="confirmPassword" label="Confirm new password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} error={errors.confirmPassword} />
            <button type="submit" disabled={saving} className={Btn.full("primary", "mt-2 py-3")}>
              {saving ? "Saving…" : "Change Password"}
            </button>
          </form>
        )}
      </Card>
    </Page>
  );
};

export default MyProfile;
