import { Link } from "react-router-dom";
import { TargetIcon, UsersIcon, MailIcon } from "../Components/icons";
import { Page, Card } from "../Components/ui";

const Section = ({ icon, title, children }) => (
  <Card className="flex gap-5">
    <div className="shrink-0 w-11 h-11 rounded-2xl bg-brand-50 border border-brand-100
      flex items-center justify-center text-brand-600">
      {icon}
    </div>
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  </Card>
);

const AboutUs = () => (
  <Page className="max-w-2xl">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">About Us</h1>
      <p className="text-sm text-gray-500 mt-1.5">Learn more about our mission and the team behind the platform.</p>
    </div>

    <div className="space-y-4">
      <Section icon={<TargetIcon size={18} />} title="Our Mission">
        We connect job seekers with the right opportunities and help companies find the best talent —
        making the hiring process efficient and rewarding for everyone.
      </Section>

      <Section icon={<UsersIcon size={18} />} title="Our Team">
        Our team of experienced professionals is dedicated to delivering exceptional value.
        Every member — from engineers to support — plays a crucial role in our success.
      </Section>

      <Section icon={<MailIcon size={18} />} title="Get in Touch">
        <p>
          Questions or feedback? Reach out through our{" "}
          <Link to="/contact" className="text-brand-600 font-medium hover:underline">
            contact page
          </Link>
          . We value your input and are continuously improving the platform based on user suggestions.
        </p>
      </Section>
    </div>
  </Page>
);

export default AboutUs;
