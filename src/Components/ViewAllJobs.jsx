import { Link } from "react-router-dom";

const ViewAllJobs = () => (
  <section className="py-10 px-4 text-center">
    <Link to="/jobs"
      className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white transition text-sm">
      View All Jobs →
    </Link>
  </section>
);

export default ViewAllJobs;
