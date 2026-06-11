import { useRef, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Page, Card, Field, inputCls, Btn } from "../Components/ui";

const INFO = [
  { icon: <FaEnvelope className="text-blue-500" />, label: "Email",   value: "contact@apptracker.com" },
  { icon: <FaPhone    className="text-blue-500" />, label: "Phone",   value: "+251 919 37 05 44" },
  { icon: <FaMapMarkerAlt className="text-blue-500" />, label: "Address", value: "123 Main Street, Addis Ababa, Ethiopia" },
];

const ContactUs = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // EmailJS removed — backend email will be wired here later
    await new Promise((r) => setTimeout(r, 600));
    toast.info("Contact form is currently unavailable. Please email us directly.");
    setLoading(false);
    e.target.reset();
  };

  return (
    <Page className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact info */}
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Get in touch</h2>
          <p className="text-sm text-gray-600 mb-6">
            Have questions or issues? Reach us using the details below or send a message via the form.
          </p>
          <ul className="space-y-4">
            {INFO.map(({ icon, label, value }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-gray-800">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Form */}
        <Card>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Send a message</h2>
          <form ref={form} onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full name" htmlFor="name">
                <input id="name" name="Your_name" type="text" required placeholder="Jane Doe"
                  className={inputCls()} />
              </Field>
              <Field label="Email" htmlFor="email">
                <input id="email" name="email" type="email" required placeholder="you@example.com"
                  className={inputCls()} />
              </Field>
            </div>

            <Field label="Subject" htmlFor="subject">
              <input id="subject" name="subject" type="text" required placeholder="How can we help?"
                className={inputCls()} />
            </Field>

            <Field label="Message" htmlFor="message">
              <textarea id="message" name="message" rows={4} required placeholder="Your message…"
                className={inputCls() + " resize-none"} />
            </Field>

            <button type="submit" disabled={loading} className={Btn.full("primary", "mt-2")}>
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        </Card>
      </div>
    </Page>
  );
};

export default ContactUs;
