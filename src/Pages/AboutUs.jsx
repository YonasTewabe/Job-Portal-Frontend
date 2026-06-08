import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="container mx-auto py-10 px-6">
      <br />
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">About Us</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4 text-gray-700">
          Our mission is to connect job seekers with the right opportunities and
          help companies find the best talent. We strive to make the job search
          process efficient and rewarding for both parties.
        </p>
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <p className="mb-4 text-gray-700">
          Our team consists of experienced professionals dedicated to providing
          exceptional service to our users. From developers to customer support,
          each member plays a crucial role in our success.
        </p>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions or feedback, please don&apos;t hesitate to
          reach out to us. Our contact information can be found{" "}
          <Link to="/contact" className="text-indigo-500 font-bold">
            here
          </Link>
          . We value your input and are committed to improving our platform
          based on your suggestions.
        </p>
        <p className="text-gray-700">
          We appreciate your interest and look forward to assisting you in your
          job search or hiring process!
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
