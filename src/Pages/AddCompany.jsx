import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import CompanyForm from "../Components/CompanyForm";
import { Page } from "../Components/ui";

const AddCompany = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (authUser?.role !== "superadmin") return <NotFoundPage />;

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await axios.post("/api/companies", form);
      toast.success("Company created successfully");
      navigate("/superadmin/dashboard");
    } catch (error) {
      if (error.response?.status === 409) toast.error("Admin email already in use");
      else toast.error("Failed to create company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Company</h1>
        <p className="text-sm text-gray-500 mt-1.5">Create a company account with an admin user.</p>
      </div>

      <CompanyForm
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Company"
        cancelLabel="Cancel"
        onCancel={() => navigate("/superadmin/dashboard")}
      />
    </Page>
  );
};

export default AddCompany;
