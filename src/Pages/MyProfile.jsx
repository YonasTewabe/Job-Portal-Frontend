import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { EyeIcon, EyeOffIcon, PlusIcon, TrashIcon } from "../Components/icons";
import { toast } from "../utils/toast";
import { confirmDelete } from "../utils/confirm";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { patchSession } from "../utils/session";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Field, inputCls, Btn, Divider } from "../Components/ui";
import { EducationFields, ExperienceFields } from "../Components/ProfileEducationExperience";
import {
  applicantProfileSchema,
  calculateAge,
  flattenYupErrors,
  normalizeDateOfBirth,
  normalizeEducations,
  normalizeExperiences,
} from "../utils/profileSchema";
import CvFileActions from "../Components/CvFileActions";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const companyProfileSchema = Yup.object().shape({
  coName:         Yup.string().required("Company name is required"),
  coDescription:  Yup.string().required("Description is required"),
  coContactEmail: Yup.string().email("Invalid email").required("Email is required"),
  coPhone:        Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const adminProfileSchema = Yup.object().shape({
  name:  Yup.string().trim().required("Name is required").min(2, "At least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
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
        {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
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

  // Job seeker profiles
  const [profiles, setProfiles]       = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [fullname, setFullname]       = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex]                 = useState("");
  const [educations, setEducations]   = useState([{ degree: "", university: "", startDate: "", endDate: "" }]);
  const [experiences, setExperiences] = useState([{ title: "", company: "", startDate: "", endDate: "" }]);
  const [userPhone, setUserPhone]     = useState("");
  const [cv, setCv]                   = useState(null);
  const [existingCv, setExistingCv]   = useState("");
  const [email, setEmail]             = useState("");

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

  const applyProfileToForm = useCallback((data) => {
    setProfileName(data.profileName ?? "");
    setFullname(data.fullname ?? "");
    setDateOfBirth(normalizeDateOfBirth(data));
    setSex(data.sex ?? "");
    setEducations(normalizeEducations(data));
    setExperiences(normalizeExperiences(data));
    setUserPhone(data.userPhone ?? data.userphone ?? data.phone ?? "");
    setEmail(data.email ?? "");
    setExistingCv(data.cv ?? "");
    setCv(null);
  }, []);

  const loadProfiles = useCallback(async (preferredId) => {
    const { data } = await axios.get("/api/applicants/me/profiles");
    const list = Array.isArray(data) ? data : [];
    setProfiles(list);

    const nextId = preferredId && list.some((p) => p.id === preferredId)
      ? preferredId
      : list[0]?.id ?? null;
    setSelectedProfileId(nextId);

    const active = list.find((p) => p.id === nextId);
    if (active) applyProfileToForm(active);
    return list;
  }, [applyProfileToForm]);

  useEffect(() => {
    if (!authUser) return;

    const load = async () => {
      setLoading(true);
      try {
        if (role === "user") {
          await loadProfiles();
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
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authUser, role, userId, loadProfiles]);

  const handleSelectProfile = async (profileId) => {
    if (profileId === selectedProfileId) return;
    setSelectedProfileId(profileId);
    setErrors({});
    try {
      const { data } = await axios.get(`/api/applicants/me/profiles/${profileId}`);
      applyProfileToForm(data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  const handleCreateProfile = async () => {
    try {
      const { data } = await axios.post("/api/applicants/me/profiles", {});
      toast.success("New profile created");
      await loadProfiles(data.id);
    } catch {
      toast.error("Failed to create profile");
    }
  };

  const handleDeleteProfile = () => {
    if (!selectedProfileId || profiles.length <= 1) return;

    confirmDelete({
      title: "Delete this profile?",
      text: "This cannot be undone. Profiles with applications cannot be deleted.",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await axios.delete(`/api/applicants/me/profiles/${selectedProfileId}`);
        toast.success("Profile deleted");
        await loadProfiles();
      } catch (error) {
        toast.error(error.response?.data?.message ?? "Failed to delete profile");
      }
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (role === "user") {
        applicantProfileSchema.validateSync(
          { profileName, fullname, email, dateOfBirth, sex, educations, experiences, userPhone },
          { abortEarly: false }
        );
      } else if (role === "company_admin") {
        adminProfileSchema.validateSync({ name, email }, { abortEarly: false });
        companyProfileSchema.validateSync(
          { coName, coDescription, coContactEmail, coPhone },
          { abortEarly: false }
        );
      } else {
        adminProfileSchema.validateSync({ name, email }, { abortEarly: false });
      }
    } catch (err) {
      setErrors(flattenYupErrors(err));
      return;
    }

    setSaving(true);
    try {
      if (role === "user") {
        if (!selectedProfileId) {
          toast.error("No profile selected");
          return;
        }
        const payload = {
          profileName: profileName.trim() || undefined,
          fullname,
          email,
          dateOfBirth,
          sex,
          educations: educations.map(({ endDate, ...entry }) => ({
            ...entry,
            ...(endDate ? { endDate } : {}),
          })),
          experiences: experiences.map(({ endDate, ...entry }) => ({
            ...entry,
            ...(endDate ? { endDate } : {}),
          })),
          userPhone,
        };
        await axios.patch(`/api/applicants/me/profiles/${selectedProfileId}`, payload);
        if (cv) {
          const fd = new FormData();
          fd.append("file", cv);
          await axios.post(`/api/applicants/me/profiles/${selectedProfileId}/cv`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        if (profiles.length === 1) patchSession({ name: fullname });
        await loadProfiles(selectedProfileId);
      } else if (role === "company_admin") {
        if (!companyId) {
          toast.error("Company not found");
          return;
        }
        await axios.patch(`/api/users/${userId}`, { name, email });
        await axios.patch(`/api/companies/${companyId}`, {
          name: coName,
          description: coDescription,
          contactEmail: coContactEmail,
          phone: coPhone,
        });
        patchSession({ name });
      } else {
        await axios.patch(`/api/users/${userId}`, { name, email });
        patchSession({ name });
      }
      refreshSession();
      toast.success("Profile updated");
    } catch (error) {
      if (error.response?.status === 409) toast.error("Email already in use");
      else toast.error("Failed to update profile");
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
    superadmin:    "Super Admin",
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
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-gray-700">Application profiles</p>
                    <button type="button" onClick={handleCreateProfile} className={Btn.secondary("gap-2 text-xs py-2 px-3")}>
                      <PlusIcon size={10} /> New profile
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => handleSelectProfile(profile.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                          ${selectedProfileId === profile.id
                            ? "bg-brand-50 text-brand-700 border-brand-200"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                      >
                        {profile.profileName || "Profile"}
                        {profile.profileCompleted && (
                          <span className="ml-1.5 text-emerald-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {profiles.length > 1 && (
                    <button type="button" onClick={handleDeleteProfile} className={Btn.danger("gap-2 text-xs py-2 px-3")}>
                      <TrashIcon size={10} /> Delete selected profile
                    </button>
                  )}
                  <p className="text-xs text-gray-500">
                    Create separate profiles for different roles or CVs. When applying, you can choose which profile to use.
                  </p>
                </div>

                <Field label="Profile name" htmlFor="profileName" error={errors.profileName}>
                  <input id="profileName" type="text" value={profileName}
                    onChange={(e) => setProfileName(e.target.value)} className={inputCls(errors.profileName)}
                    placeholder="How you'll identify this profile" />
                </Field>

                <Field label="Full name" htmlFor="fullname" error={errors.fullname}>
                  <input id="fullname" type="text" value={fullname}
                    onChange={(e) => setFullname(e.target.value)} className={inputCls(errors.fullname)} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email" htmlFor="email" error={errors.email}>
                    <input id="email" type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
                  </Field>
                  <PhoneInput id="userPhone" value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)} error={errors.userPhone} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth}
                    hint={dateOfBirth ? `Age: ${calculateAge(dateOfBirth) ?? "—"}` : undefined}>
                    <input id="dateOfBirth" type="date" value={dateOfBirth} max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setDateOfBirth(e.target.value)} className={inputCls(errors.dateOfBirth)} />
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
                <EducationFields
                  educations={educations}
                  setEducations={setEducations}
                  errors={errors}
                />
                <ExperienceFields
                  experiences={experiences}
                  setExperiences={setExperiences}
                  errors={errors}
                />
                <Field label="CV (PDF)" htmlFor="cv">
                  {existingCv ? (
                    <CvFileActions filename={existingCv} showFilename className="mb-3" />
                  ) : (
                    <p className="mb-3 text-xs text-gray-400">No CV uploaded yet</p>
                  )}
                  <input id="cv" type="file" accept="application/pdf"
                    onChange={(e) => setCv(e.target.files[0] ?? null)}
                    className="block w-full text-sm text-gray-500
                      file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                      file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700
                      hover:file:bg-brand-100 transition-all" />
                  {cv && (
                    <p className="mt-1.5 text-xs text-brand-600 font-medium">
                      New file selected: {cv.name}
                    </p>
                  )}
                </Field>
              </>
            )}

            {role === "company_admin" && (
              <>
                <Field label="Your name" htmlFor="name" error={errors.name}>
                  <input id="name" type="text" value={name}
                    onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
                </Field>
                <Field label="Login email" htmlFor="email" error={errors.email}>
                  <input id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
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

            {role === "superadmin" && (
              <>
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <input id="name" type="text" value={name}
                    onChange={(e) => setName(e.target.value)} className={inputCls(errors.name)} />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email}>
                  <input id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
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
