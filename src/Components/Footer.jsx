import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-background text-white py-6 text-center text-sm mt-auto">
    <p className="mb-2 text-white/70">© {new Date().getFullYear()} Application Tracker. All rights reserved.</p>
    <div className="flex justify-center gap-6">
      <Link to="/contact" className="hover:text-white/80 transition">Contact Us</Link>
      <Link to="/about"   className="hover:text-white/80 transition">About Us</Link>
    </div>
  </footer>
);

export default Footer;
