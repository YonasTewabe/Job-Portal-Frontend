import { Field, inputCls, Btn } from "./ui";
import { formatDateForInput } from "../utils/profileSchema";

export const EMPTY_EDUCATION = { degree: "", university: "", startDate: "", endDate: "" };
export const EMPTY_EXPERIENCE = { title: "", company: "", startDate: "", endDate: "" };

const formatRange = (startDate, endDate) => {
  const start = formatDateForInput(startDate);
  const end = formatDateForInput(endDate);
  if (!start && !end) return "";
  if (start && end) return ` (${start} – ${end})`;
  if (start) return ` (${start} – Present)`;
  return "";
};

const EntryCard = ({ children, onRemove, canRemove }) => (
  <div className="rounded-xl border border-gray-100 bg-slate-50/60 p-4 space-y-4">
    {children}
    {canRemove && (
      <button
        type="button"
        onClick={onRemove}
        className={Btn.ghost("text-xs text-red-600 hover:text-red-700 py-1.5")}
      >
        Remove
      </button>
    )}
  </div>
);

const DateRangeFields = ({ index, prefix, entry, update, errors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Field
      label="Start date"
      htmlFor={`${prefix}-start-${index}`}
      error={errors[`${prefix}.${index}.startDate`]}
    >
      <input
        id={`${prefix}-start-${index}`}
        type="date"
        value={entry.startDate ?? ""}
        onChange={(e) => update(index, "startDate", e.target.value)}
        className={inputCls(errors[`${prefix}.${index}.startDate`])}
      />
    </Field>
    <Field
      label="End date"
      htmlFor={`${prefix}-end-${index}`}
      error={errors[`${prefix}.${index}.endDate`]}
      hint="Leave empty if current"
    >
      <input
        id={`${prefix}-end-${index}`}
        type="date"
        value={entry.endDate ?? ""}
        onChange={(e) => update(index, "endDate", e.target.value)}
        className={inputCls(errors[`${prefix}.${index}.endDate`])}
      />
    </Field>
  </div>
);

export const EducationFields = ({ educations, setEducations, errors = {} }) => {
  const update = (index, field, value) => {
    setEducations((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const add = () => setEducations((prev) => [...prev, { ...EMPTY_EDUCATION }]);
  const remove = (index) => setEducations((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Education</h3>
        <button type="button" onClick={add} className={Btn.ghost("text-xs py-1.5 px-2")}>
          + Add education
        </button>
      </div>

      {errors.educations && typeof errors.educations === "string" && (
        <p className="text-xs text-red-500">{errors.educations}</p>
      )}

      {educations.map((entry, index) => (
        <EntryCard key={index} onRemove={() => remove(index)} canRemove={educations.length > 1}>
          <Field
            label="Degree"
            htmlFor={`degree-${index}`}
            error={errors[`educations.${index}.degree`]}
          >
            <input
              id={`degree-${index}`}
              type="text"
              placeholder="e.g. BSc Computer Science"
              value={entry.degree}
              onChange={(e) => update(index, "degree", e.target.value)}
              className={inputCls(errors[`educations.${index}.degree`])}
            />
          </Field>
          <Field
            label="University / Institution"
            htmlFor={`university-${index}`}
            error={errors[`educations.${index}.university`]}
          >
            <input
              id={`university-${index}`}
              type="text"
              placeholder="Institution name"
              value={entry.university}
              onChange={(e) => update(index, "university", e.target.value)}
              className={inputCls(errors[`educations.${index}.university`])}
            />
          </Field>
          <DateRangeFields
            index={index}
            prefix="educations"
            entry={entry}
            update={update}
            errors={errors}
          />
        </EntryCard>
      ))}
    </div>
  );
};

export const ExperienceFields = ({ experiences, setExperiences, errors = {} }) => {
  const update = (index, field, value) => {
    setExperiences((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const add = () => setExperiences((prev) => [...prev, { ...EMPTY_EXPERIENCE }]);
  const remove = (index) => setExperiences((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          Work experience
        </h3>
        <button type="button" onClick={add} className={Btn.ghost("text-xs py-1.5 px-2")}>
          + Add experience
        </button>
      </div>

      {errors.experiences && typeof errors.experiences === "string" && (
        <p className="text-xs text-red-500">{errors.experiences}</p>
      )}

      {experiences.map((entry, index) => (
        <EntryCard key={index} onRemove={() => remove(index)} canRemove={experiences.length > 1}>
          <Field
            label="Job title"
            htmlFor={`title-${index}`}
            error={errors[`experiences.${index}.title`]}
          >
            <input
              id={`title-${index}`}
              type="text"
              placeholder="e.g. Software Engineer"
              value={entry.title}
              onChange={(e) => update(index, "title", e.target.value)}
              className={inputCls(errors[`experiences.${index}.title`])}
            />
          </Field>
          <Field
            label="Company"
            htmlFor={`company-${index}`}
            error={errors[`experiences.${index}.company`]}
          >
            <input
              id={`company-${index}`}
              type="text"
              placeholder="Where you worked"
              value={entry.company}
              onChange={(e) => update(index, "company", e.target.value)}
              className={inputCls(errors[`experiences.${index}.company`])}
            />
          </Field>
          <DateRangeFields
            index={index}
            prefix="experiences"
            entry={entry}
            update={update}
            errors={errors}
          />
        </EntryCard>
      ))}
    </div>
  );
};

export const formatEducationSummary = (educations = []) =>
  educations.length
    ? educations
        .map((e) => `${e.degree} — ${e.university}${formatRange(e.startDate, e.endDate)}`)
        .join("; ")
    : "—";

export const formatExperienceSummary = (experiences = []) =>
  experiences.length
    ? experiences
        .map((e) => `${e.title} at ${e.company}${formatRange(e.startDate, e.endDate)}`)
        .join("; ")
    : "—";
