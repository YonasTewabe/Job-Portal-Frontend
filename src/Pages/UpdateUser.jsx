import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosInterceptor";
import { toast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";
import { EducationFields, ExperienceFields } from "../Components/ProfileEducationExperience";
import {
  applicantProfileSchema,
  calculateAge,
  flattenYupErrors,
  normalizeDateOfBirth,
  normalizeEducations,
  normalizeExperiences,
} from "../utils/profileSchema";

const buildPayload = ({ fullname, email, dateOfBirth, sex, educations, experiences, userPhone }) => ({
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
});

const UpdateUser = () => {
  const [fullname, setFullname]       = useState("");
  const [email, setEmail]             = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex]                 = useState("");
  const [educations, setEducations]   = useState([{ degree: "", university: "", startDate: "", endDate: "" }]);
  const [experiences, setExperiences] = useState([{ title: "", company: "", startDate: "", endDate: "" }]);
  const [cv, setCv]                   = useState(null);
  const [userPhone, setUserPhone]     = useState("");
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(true);

  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get("/api/applicants/me")
      .then(({ data }) => {
        setFullname(data.fullname ?? "");
        setEmail(data.email ?? "");
        setDateOfBirth(normalizeDateOfBirth(data));
        setSex(data.sex ?? "");
        setEducations(normalizeEducations(data));
        setExperiences(normalizeExperiences(data));
        setUserPhone(data.userPhone ?? data.phone ?? "");
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setFetching(false));
  }, []);

  if (authUser?.role !== "user") return <NotFoundPage />;
  if (fetching) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = { fullname, email, dateOfBirth, sex, educations, experiences, userPhone };
    try {
      applicantProfileSchema.validateSync(form, { abortEarly: false });
      setErrors({});
    } catch (err) {
      setErrors(flattenYupErrors(err));
      return;
    }

    setLoading(true);
    try {
      await axios.patch("/api/applicants/me", buildPayload(form));
      if (cv) {
        const fd = new FormData();
        fd.append("file", cv);
        await axios.post("/api/applicants/me/cv", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success("Profile updated");
      navigate(`/account/${id}`);
    } catch (error) {
      if (error.response?.status === 409) toast.error("Email already in use");
      else toast.error("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard title="Update Your Profile" subtitle="Keep your information up to date.">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" htmlFor="fullname" error={errors.fullname}>
          <input id="fullname" type="text" placeholder="Your full name"
            value={fullname} onChange={(e) => setFullname(e.target.value)} className={inputCls(errors.fullname)} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" htmlFor="email" error={errors.email}>
            <input id="email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls(errors.email)} />
          </Field>

          <Field label="Phone number" htmlFor="userPhone" error={errors.userPhone}>
            <div className="flex">
              <span className="flex items-center px-3.5 rounded-l-xl border border-r-0 border-gray-200
                bg-gray-50 text-sm text-gray-500 font-medium">
                +251
              </span>
              <input id="userPhone" type="tel" placeholder="9-digit number" maxLength={9}
                value={userPhone} onChange={(e) => setUserPhone(e.target.value)}
                className={inputCls(errors.userPhone) + " rounded-l-none"} />
            </div>
          </Field>
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
                    onChange={(e) => setSex(e.target.value)}
                    className="accent-brand-600 w-4 h-4" />
                  {s}
                </label>
              ))}
            </div>
            {errors.sex && <p className="mt-1.5 text-xs text-red-500">{errors.sex}</p>}
          </Field>
        </div>

        <EducationFields educations={educations} setEducations={setEducations} errors={errors} />
        <ExperienceFields experiences={experiences} setExperiences={setExperiences} errors={errors} />

        <Field label="CV (PDF)" htmlFor="cv">
          <input id="cv" type="file" accept="application/pdf"
            onChange={(e) => setCv(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
              file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700
              hover:file:bg-brand-100 transition-all" />
        </Field>

        <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </FormCard>
  );
};

export default UpdateUser;
