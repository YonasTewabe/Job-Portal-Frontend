import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { useCompany } from "../hooks/useCompany";
import { initializeChapaPayment } from "../utils/chapa";
import NotFoundPage from "./NotFoundPage";
import Spinner from "../Components/Spinner";
import axios from "../axiosInterceptor";
import { Btn, Field, FormCard, inputCls } from "../Components/ui";

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const { amount, currency, pendingJob, payerInfo, setPayerInfo, setTxRef } = usePayment();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "company_admin") return;

    let cancelled = false;
    setFetchingProfile(true);

    axios
      .get("/api/users/me")
      .then(({ data }) => {
        if (cancelled) return;
        setPayerInfo({
          paymentPersonName: data.name || user.name || "",
          paymentPersonEmail: data.email || company?.contactEmail || "",
          paymentPersonPhoneNumber: company?.phone || "",
        });
      })
      .catch(() => {
        if (cancelled) return;
        setPayerInfo({
          paymentPersonName: user.name || "",
          paymentPersonEmail: company?.contactEmail || "",
          paymentPersonPhoneNumber: company?.phone || "",
        });
      })
      .finally(() => {
        if (!cancelled) setFetchingProfile(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, company, setPayerInfo]);

  if (user?.role !== "company_admin") return <NotFoundPage />;
  if (companyLoading || fetchingProfile) {
    return (
      <div className="py-24">
        <Spinner loading />
      </div>
    );
  }
  if (!pendingJob?.title) {
    return <Navigate to="/add-job" replace />;
  }

  const formatNumber = (price) => new Intl.NumberFormat("en-US").format(price);

  const handlePayment = async () => {
    if (!agreedToTerms) {
      toast.warning("Please agree to the terms and conditions");
      return;
    }

    const { paymentPersonName, paymentPersonEmail, paymentPersonPhoneNumber } = payerInfo;
    if (!paymentPersonName || !paymentPersonEmail || !paymentPersonPhoneNumber) {
      toast.error("Please fill in all payer information fields");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await initializeChapaPayment({
      amount: Number(amount).toFixed(2),
      email: paymentPersonEmail,
      first_name: paymentPersonName,
      last_name: "",
      phone: paymentPersonPhoneNumber,
      onTxRef: setTxRef,
    });

    if (!result.success) {
      setErrorMessage("Could not start payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <FormCard title="Complete payment" subtitle="Pay the job posting fee to publish your listing.">
      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mb-6 rounded-xl bg-brand-50 border border-brand-100 px-4 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Job to publish
        </p>
        <p className="text-sm font-semibold text-gray-900">{pendingJob.title}</p>
        <p className="text-xs text-gray-500 mt-1">
          {pendingJob.type} · {pendingJob.location}
        </p>
        <div className="mt-3 pt-3 border-t border-brand-100 flex justify-between items-center">
          <span className="text-sm text-gray-600">Posting fee</span>
          <span className="text-lg font-bold text-brand-700">
            {formatNumber(amount)} {currency}
          </span>
        </div>
      </div>

      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
        Payer information
      </h2>

      <Field label="Full name" htmlFor="paymentPersonName">
        <input
          id="paymentPersonName"
          type="text"
          placeholder="Enter full name"
          value={payerInfo.paymentPersonName}
          onChange={(e) => setPayerInfo({ paymentPersonName: e.target.value })}
          className={inputCls()}
        />
      </Field>

      <Field label="Email" htmlFor="paymentPersonEmail">
        <input
          id="paymentPersonEmail"
          type="email"
          placeholder="Enter email"
          value={payerInfo.paymentPersonEmail}
          onChange={(e) => setPayerInfo({ paymentPersonEmail: e.target.value })}
          className={inputCls()}
        />
      </Field>

      <Field label="Phone number" htmlFor="paymentPersonPhoneNumber">
        <input
          id="paymentPersonPhoneNumber"
          type="tel"
          placeholder="Enter phone number"
          value={payerInfo.paymentPersonPhoneNumber}
          onChange={(e) => setPayerInfo({ paymentPersonPhoneNumber: e.target.value })}
          className={inputCls()}
        />
      </Field>

      <label className="flex items-start gap-2.5 mt-2 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-gray-600">
          I agree to the{" "}
          <Link to="/about" className="link-brand">
            Terms &amp; Conditions
          </Link>
        </span>
      </label>

      <button
        type="button"
        onClick={handlePayment}
        disabled={loading || !agreedToTerms}
        className={Btn.full("primary", "py-3")}
      >
        {loading ? "Redirecting to Chapa…" : `Pay ${formatNumber(amount)} ${currency}`}
      </button>

      <button
        type="button"
        onClick={() => navigate("/add-job")}
        className={Btn.ghost("w-full mt-3 py-2.5")}
      >
        ← Back to job form
      </button>
    </FormCard>
  );
};

export default PaymentCheckout;
