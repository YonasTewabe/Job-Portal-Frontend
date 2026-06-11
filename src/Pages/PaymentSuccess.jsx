import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../axiosInterceptor";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import NotFoundPage from "./NotFoundPage";
import { Btn, FormCard } from "../Components/ui";
import Spinner from "../Components/Spinner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { pendingJob, setPaymentVerified, resetPaymentStore } = usePayment();

  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");
    const txRef = searchParams.get("tx_ref");

    if (redirectStatus) {
      setPaymentStatus("Payment Verification Successful");
      setPaymentSuccess(true);
      setPaymentVerified(true, txRef);
      setIsLoading(false);
      return;
    }

    if (txRef) {
      api
        .get(`/api/chapa/verify?tx_ref=${encodeURIComponent(txRef)}`)
        .then(({ data }) => {
          if (data.status === "success") {
            setPaymentStatus("Payment Verification Successful");
            setPaymentSuccess(true);
            setPaymentVerified(true, txRef);
          } else {
            setPaymentStatus("Payment Verification Failed");
            setPaymentSuccess(false);
          }
        })
        .catch(() => {
          setPaymentStatus("Error verifying payment");
          setPaymentSuccess(false);
        })
        .finally(() => setIsLoading(false));
      return;
    }

    setPaymentStatus("Payment Verification Failed. Please contact support.");
    setPaymentSuccess(false);
    setIsLoading(false);
  }, [searchParams, setPaymentVerified]);

  if (user && user.role !== "company_admin") return <NotFoundPage />;

  const handleContinue = async () => {
    if (!pendingJob?.title || !pendingJob?.companyId) {
      toast.error("Job details missing. Please fill out the job form again.");
      navigate("/add-job");
      return;
    }

    setPosting(true);
    try {
      await api.post("/api/jobs", pendingJob);
      toast.success("Job posted successfully");
      resetPaymentStore();
      navigate("/company/dashboard");
    } catch {
      toast.error("Payment succeeded but job posting failed. Please contact support.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <FormCard title="Payment status">
      <div className="flex flex-col items-center text-center space-y-5 py-2">
        {isLoading ? (
          <>
            <Spinner />
            <h2 className="text-xl font-semibold text-gray-900">Verifying payment…</h2>
            <p className="text-sm text-gray-500">Please wait while we confirm your transaction.</p>
          </>
        ) : (
          <>
            {paymentSuccess === true && (
              <FaCheckCircle className="text-5xl text-emerald-500" />
            )}
            {paymentSuccess === false && (
              <FaTimesCircle className="text-5xl text-red-500" />
            )}

            <h1
              className={`text-2xl font-bold ${
                paymentSuccess ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {paymentStatus}
            </h1>

            <p className="text-sm text-gray-500">
              {paymentSuccess
                ? "Your payment was successful. Continue to publish your job listing."
                : "We couldn't verify your payment."}
            </p>

            {paymentSuccess && pendingJob?.title && (
              <p className="text-sm text-gray-700 font-medium">
                Job: {pendingJob.title}
              </p>
            )}

            {paymentSuccess && (
              <button
                type="button"
                onClick={handleContinue}
                disabled={posting}
                className={Btn.full("primary", "py-3")}
              >
                {posting ? "Publishing job…" : "Publish job"}
              </button>
            )}

            {paymentSuccess === false && (
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={Btn.full("secondary", "py-3")}
                >
                  Try again
                </button>
                <Link to="/pay" className={Btn.ghost("w-full py-2.5 text-center")}>
                  Back to checkout
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </FormCard>
  );
};

export default PaymentSuccess;
