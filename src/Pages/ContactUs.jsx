import { useEffect, useRef, useState } from "react";
import { MailIcon, PhoneIcon, MapPinIcon } from "../Components/icons";
import { toast } from "../utils/toast";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { Page, Card, Field, inputCls, Btn } from "../Components/ui";

const INFO = [
  { icon: <MailIcon />,    label: "Email",   value: "contact@apptracker.com", color: "bg-brand-50 text-brand-500" },
  { icon: <PhoneIcon />,       label: "Phone",   value: "+251 919 37 05 44",       color: "bg-emerald-50 text-emerald-500" },
  { icon: <MapPinIcon />, label: "Address", value: "123 Main Street, Addis Ababa, Ethiopia", color: "bg-orange-50 text-orange-500" },
];

const ContactUs = () => {
  const form = useRef();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayEmail, setDisplayEmail] = useState("");

  useEffect(() => {
    if (!user) {
      setDisplayEmail("");
      return;
    }
    if (user.email) {
      setDisplayEmail(user.email);
      return;
    }
    axios.get("/api/users/me")
      .then(({ data }) => setDisplayEmail(data.email ?? ""))
      .catch(() => setDisplayEmail(""));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!subject || !message) return;

    const payload = { subject, message };

    if (!user) {
      payload.name = String(formData.get("Your_name") ?? "").trim();
      payload.email = String(formData.get("email") ?? "").trim();
      if (!payload.name || !payload.email) return;
    }

    setLoading(true);
    try {
      await axios.post("/api/chat/contact-inquiries", payload);
      toast.success(
        user
          ? "Your message was sent. You can view it under Messages."
          : "Your message was sent. We'll get back to you as soon as we can."
      );
      e.target.reset();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-gray-500 mt-1.5">We're here to help — reach out via the form or directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Send a message</h2>
          <p className="text-xs text-gray-500 mb-4">
            Your message is sent as a one-way inquiry. Replies are not available in chat — use email or phone for urgent follow-up.
          </p>
          <form ref={form} onSubmit={handleSubmit} className="space-y-1">
            {user ? (
              <div className="grid grid-cols-2 gap-3 mb-1">
                <Field label="Full name">
                  <p className="text-sm text-gray-800 font-medium py-2.5">{user.name}</p>
                </Field>
                <Field label="Email">
                  <p className="text-sm text-gray-800 font-medium py-2.5">{displayEmail || "—"}</p>
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full name" htmlFor="name">
                  <input
                    id="name"
                    name="Your_name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className={inputCls()}
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={inputCls()}
                  />
                </Field>
              </div>
            )}

            <Field label="Subject" htmlFor="subject">
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="How can we help?"
                className={inputCls()}
              />
            </Field>

            <Field label="Message" htmlFor="message">
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Your message…"
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
