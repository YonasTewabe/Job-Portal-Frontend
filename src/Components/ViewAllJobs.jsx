import { Link } from "react-router-dom";

const ViewAllJobs = () => (
  <section className="pb-16 px-4 text-center">
    <Link
      to="/jobs"
      className="btn-outline-brand px-8 py-3 rounded-2xl shadow-sm hover:shadow"
    >
      View all open positions →
    </Link>
  </section>
);

export default ViewAllJobs;
