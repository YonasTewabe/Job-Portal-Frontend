import { Link } from "react-router-dom";

const ViewAllJobs = () => (
  <section className="pb-16 px-4 text-center">
    <Link
      to="/jobs"
      className="btn-outline-brand inline-flex items-center gap-2
        font-semibold px-8 py-3 rounded-2xl
        transition-all duration-200 text-sm shadow-sm hover:shadow"
    >
      View all open positions →
    </Link>
  </section>
);

export default ViewAllJobs;
