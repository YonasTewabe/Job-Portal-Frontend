import { Link } from "react-router-dom";

const ViewAllJobs = () => (
  <section className="pb-16 sm:pb-20 px-4 text-center">
    <Link to="/jobs" className="btn-outline-brand px-8 py-3.5 rounded-2xl text-sm font-semibold">
      View all open positions →
    </Link>
  </section>
);

export default ViewAllJobs;
