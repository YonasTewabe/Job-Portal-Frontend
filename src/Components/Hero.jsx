import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <section className="bg-background py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {role === "user" && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Find Your Next Job
            </h1>
            <p className="my-4 text-xl text-white">
              Look for the job that fits your skills and needs
            </p>
          </div>
        )}
        {(role === "hr" || role === "admin") && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Find Your Next Employee
            </h1>
            <p className="my-4 text-xl text-white">
              Look for the employee that fits your needs and requirements
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
