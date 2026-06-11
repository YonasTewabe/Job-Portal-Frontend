import { useState } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import axios from "../axiosInterceptor";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import UnauthorizedAccess from "../Components/UnauthorizedAccess";
import { FormCard, Field, inputCls, Btn } from "../Components/ui";

const schema = Yup.object().shape({
  fullname:   Yup.string().matches(/^[A-Za-z ]*$/, "Letters only").required("Required"),
  age:        Yup.number().typeError("Must be a number").required("Required").positive().integer(),
  sex:        Yup.string().oneOf(["Male", "Female"], "Select one").required("Required"),
  degree:     Yup.string().required("Required"),
  university: Yup.string().required("Required"),
  experience: Yup.string().required("Required"),
  userPhone:  Yup.string().matches(/^[0-9]{9}$/, "9 digits required").required("Required"),
});

const UpdateUser = () => {
  const user = useLoaderData();
  const [fullname,   setFullname]   = useState(user.fullname   || "");
  const [age,        setAge]        = useState(user.age        || "");
  const [sex,        setSex]        = useState(user.sex        || "");
  const [degree,     setDegree]     = useState(user.degree     || "");
  const [university, setUniversity] = useState(user.university || "");
  const [experience, setExperience] = useState(user.experience || "None");
  const [cv,         setCv]         = useState(null);
  const [userPhone,  setUserPhone]  = useState(user.userPhone  || "");
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);

  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { id }   = useParams();

  if (authUser?.role !== "user") return <UnauthorizedAccess />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      schema.validateSync({ fullname, age, sex, degree, university, experience, userPhone }, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const fe = {};
      err.inner.forEach((e) => { fe[e.path] = e.message; });
      setErrors(fe);
      return;
    }

    setLoading(true);
    try {
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
      toast.success("Profile updated");
      navigate(`/account/${id}`);
    } catch { toast.error("Failed to update. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <FormCard title="Update Your Profile" subtitle="Keep your information up to date.">
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Full name" htmlFor="fullname" error={errors.fullname}>
          <input id="fullname" type="text" placeholder="Your full name"
            value={fullname} onChange={(e) => setFullname(e.target.value)} className={inputCls(errors.fullname)} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Age" htmlFor="age" error={errors.age}>
            <input id="age" type="text" placeholder="e.g. 25"
              value={age} onChange={(e) => setAge(e.target.value)} maxLength={2} className={inputCls(errors.age)} />
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

        <Field label="Degree" htmlFor="degree" error={errors.degree}>
          <input id="degree" type="text" placeholder="e.g. BSc Computer Science"
            value={degree} onChange={(e) => setDegree(e.target.value)} className={inputCls(errors.degree)} />
        </Field>

        <Field label="University" htmlFor="university" error={errors.university}>
          <input id="university" type="text" placeholder="Institution name"
            value={university} onChange={(e) => setUniversity(e.target.value)} className={inputCls(errors.university)} />
        </Field>

        <Field label="Experience" htmlFor="experience" error={errors.experience}>
          <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className={inputCls(errors.experience)}>
            {["None", "Less than 1 Year", "1 - 3 years", "3 - 5 years", "5+ years"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
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
