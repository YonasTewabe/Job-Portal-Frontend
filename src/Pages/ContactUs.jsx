import { useRef, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Page, Card, Field, inputCls, Btn } from "../Components/ui";

const INFO = [
  { icon: <FaEnvelope />,    label: "Email",   value: "contact@apptracker.com", color: "bg-brand-50 text-brand-500" },
  { icon: <FaPhone />,       label: "Phone",   value: "+251 919 37 05 44",       color: "bg-emerald-50 text-emerald-500" },
  { icon: <FaMapMarkerAlt />, label: "Address", value: "123 Main Street, Addis Ababa, Ethiopia", color: "bg-orange-50 text-orange-500" },
];

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.info("Contact form is currently unavailable. Please email us directly.");
    setLoading(false);
    e.target.reset();
  };

  return (
    <Page className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-gray-500 mt-1.5">We're here to help — reach out via the form or directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Get in touch</h2>
          <ul className="space-y-5">
            {INFO.map(({ icon, label, value, color }) => (
              <li key={label} className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm text-gray-800 font-medium">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Form */}
        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Send a message</h2>
          <form ref={form} onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" htmlFor="name">
                <input
                  id="name" name="Your_name" type="text" required placeholder="Jane Doe"
                  className={inputCls()}
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <input
                  id="email" name="email" type="email" required placeholder="you@example.com"
                  className={inputCls()}
                />
              </Field>
            </div>

            <Field label="Subject" htmlFor="subject">
              <input
                id="subject" name="subject" type="text" required placeholder="How can we help?"
                className={inputCls()}
              />
            </Field>

            <Field label="Message" htmlFor="message">
              <textarea
                id="message" name="message" rows={5} required placeholder="Your message…"
                className={inputCls() + " resize-none"}
              />
            </Field>

            <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2 py-3")}>
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
};

export default ContactUs;
