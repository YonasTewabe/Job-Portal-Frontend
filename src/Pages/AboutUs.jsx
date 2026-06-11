import { Link } from "react-router-dom";
import { FaBullseye, FaUsers, FaEnvelope } from "react-icons/fa";
import { Page, Card } from "../Components/ui";

const Section = ({ icon, title, children }) => (
  <Card className="flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
      {icon}
    </div>
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  </Card>
);

const AboutUs = () => (
  <Page className="max-w-2xl">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">About Us</h1>

    <div className="space-y-4">
      <Section icon={<FaBullseye size={18} />} title="Our Mission">
        We connect job seekers with the right opportunities and help companies find the best talent —
        making the hiring process efficient and rewarding for everyone.
      </Section>

      <Section icon={<FaUsers size={18} />} title="Our Team">
        Our team of experienced professionals is dedicated to delivering exceptional value.
        Every member — from engineers to support — plays a crucial role in our success.
      </Section>

      <Section icon={<FaEnvelope size={18} />} title="Get in Touch">
        <p>
          Questions or feedback? Reach out through our{" "}
          <Link to="/contact" className="text-blue-600 font-medium hover:underline">
            contact page
          </Link>
          . We value your input and are continuously improving the platform based on user suggestions.
        </p>
      </Section>
    </div>
  </Page>
);

export default AboutUs;
