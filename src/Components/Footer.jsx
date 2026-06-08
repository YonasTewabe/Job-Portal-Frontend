import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="bg-background md-flex text-white py-4 text-center 
         absolute min-h-screen w-full"
    >
      <p>&#169; 2024 All Rights Reserved!</p>
      <div className="mt-4">
        <Link to="/contact" className="text-white mx-2">
          Contact Us
        </Link>
        <Link to="/about" className="text-white mx-2">
          About Us
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
