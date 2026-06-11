import { Link } from "react-router-dom";

const ViewAllJobs = () => (
  <section className="pb-16 px-4 text-center">
    <Link
      to="/jobs"
      className="inline-flex items-center gap-2 bg-white border-2 border-brand-600 text-brand-600
        font-semibold px-8 py-3 rounded-2xl hover:bg-brand-600 hover:text-white
        transition-all duration-200 text-sm shadow-sm hover:shadow"
    >
      View all open positions →
    </Link>
  </section>
);

export default ViewAllJobs;
