import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const SuspendedAccount = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center h-screen">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />
      <h1 className="text-5xl font-bold mb-4">Account Suspended</h1>
      <br />
      <p className="text-xl mb-5">
        Sorry, your account is temporarily suspended from posting jobs.
      </p>
      <p className="text-xl mb-5">
        If you think this was a mistake please reach out to us using the contact
        form.
      </p>

      <Link
        to="/contact"
        className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
      >
        Contact
      </Link>
    </section>
  );
};

export default SuspendedAccount;
