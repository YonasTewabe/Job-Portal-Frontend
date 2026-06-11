import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "./NotFoundPage";
import Spinner from "../Components/Spinner";
import { Page, PageTitle, Card, Field, inputCls, Btn } from "../Components/ui";

const SuperAdminPricing = () => {
  const { user } = useAuth();
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== "superadmin") return;

    axios
      .get("/api/pricing")
      .then(({ data }) => {
        setPrice(String(data.jobPostingPrice ?? ""));
        setCurrency(data.currency ?? "ETB");
      })
      .catch(() => toast.error("Failed to load pricing"))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role !== "superadmin") return <NotFoundPage />;
  if (loading) return <div className="py-24"><Spinner loading /></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = Number(price);
    if (Number.isNaN(parsed) || parsed < 0) {
      toast.error("Enter a valid price");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.patch("/api/pricing", { jobPostingPrice: parsed });
      setPrice(String(data.jobPostingPrice));
      setCurrency(data.currency ?? "ETB");
      toast.success("Job posting price updated");
    } catch {
      toast.error("Failed to update pricing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page className="max-w-lg">
      <div className="mb-8">
        <PageTitle>Job Posting Price</PageTitle>
        <p className="text-sm text-gray-500 mt-1">
          Set the fee company admins pay via Chapa each time they post a job.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate>
          <Field label={`Price (${currency})`} htmlFor="jobPostingPrice">
            <input
              id="jobPostingPrice"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputCls()}
              placeholder="e.g. 100"
            />
          </Field>

          <p className="text-xs text-gray-500 mb-6">
            This amount is charged in Ethiopian Birr (ETB) through Chapa when a company admin publishes a job listing.
          </p>

          <button type="submit" disabled={saving} className={Btn.full("primary", "py-3")}>
            {saving ? "Saving…" : "Save price"}
          </button>
        </form>
      </Card>
    </Page>
  );
};

export default SuperAdminPricing;
