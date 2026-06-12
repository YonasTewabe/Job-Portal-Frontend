import * as Yup from "yup";

const dateField = (label) => Yup.string().required(`${label} is required`);

const optionalEndDate = Yup.string()
  .nullable()
  .test("end-after-start", "End date must be on or after start date", function (value) {
    if (!value) return true;
    const start = this.parent.startDate;
    if (!start) return true;
    return new Date(value) >= new Date(start);
  });

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const formatDateForInput = (value) => {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

export const applicantProfileSchema = Yup.object().shape({
  profileName: Yup.string().trim().max(80, "Max 80 characters"),
  fullname: Yup.string()
    .matches(/^[A-Za-z ]*$/, "Letters only")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .test("valid-dob", "Enter a valid date of birth", (value) => {
      if (!value) return false;
      const dob = new Date(`${value}T00:00:00`);
      if (Number.isNaN(dob.getTime())) return false;
      const age = calculateAge(value);
      return age !== null && age >= 16 && age <= 100;
    }),
  sex: Yup.string().oneOf(["Male", "Female"], "Select one").required("Required"),
  userPhone: Yup.string()
    .matches(/^[0-9]{9}$/, "9 digits required")
    .required("Required"),
  educations: Yup.array()
    .of(
      Yup.object({
        degree: Yup.string().trim().required("Degree is required"),
        university: Yup.string().trim().required("University is required"),
        startDate: dateField("Start date"),
        endDate: optionalEndDate,
      })
    )
    .min(1, "Add at least one education"),
  experiences: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().trim().required("Job title is required"),
        company: Yup.string().trim().required("Company is required"),
        startDate: dateField("Start date"),
        endDate: optionalEndDate,
      })
    )
    .min(1, "Add at least one work experience"),
});

export const flattenYupErrors = (err) => {
  const fe = {};
  err.inner.forEach((item) => {
    fe[item.path] = item.message;
  });
  return fe;
};

export const normalizeEducations = (data) => {
  if (Array.isArray(data?.educations) && data.educations.length) {
    return data.educations.map((e) => ({
      degree: e.degree ?? "",
      university: e.university ?? "",
      startDate: formatDateForInput(e.startDate),
      endDate: formatDateForInput(e.endDate),
    }));
  }
  if (data?.degree || data?.university) {
    return [
      {
        degree: data.degree ?? "",
        university: data.university ?? "",
        startDate: "",
        endDate: "",
      },
    ];
  }
  return [{ degree: "", university: "", startDate: "", endDate: "" }];
};

export const normalizeExperiences = (data) => {
  if (Array.isArray(data?.experiences) && data.experiences.length) {
    return data.experiences.map((e) => ({
      title: e.title ?? "",
      company: e.company ?? "",
      startDate: formatDateForInput(e.startDate),
      endDate: formatDateForInput(e.endDate),
    }));
  }
  return [{ title: "", company: "", startDate: "", endDate: "" }];
};

export const normalizeDateOfBirth = (data) => formatDateForInput(data?.dateOfBirth) || "";
