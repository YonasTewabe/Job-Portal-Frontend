import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "../Components/icons";
import { toast } from "../utils/toast";
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
  const {
    pendingJob,
    amount,
    currency,
    payerInfo,
    txRef: storedTxRef,
    setPaymentVerified,
    resetPaymentStore,
  } = usePayment();

  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [draftJobId, setDraftJobId] = useState(null);

  const buildJobPayload = () => {
    if (!pendingJob?.title) return null;
    const { companyId: _companyId, ...job } = pendingJob;
    return job;
  };

  const recordPayment = async (txRef) => {
    if (!txRef || !pendingJob?.title) return null;
    const job = buildJobPayload();
    try {
      const { data } = await api.post("/api/payments/record", {
        txRef,
        amount: Number(amount),
        currency: currency || "ETB",
        jobTitle: pendingJob.title,
        payerName: payerInfo.paymentPersonName,
        payerEmail: payerInfo.paymentPersonEmail,
        payerPhone: payerInfo.paymentPersonPhoneNumber,
        ...(job ? { job } : {}),
      });
      return data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");
    const txRef = searchParams.get("tx_ref");

    const onVerified = async (ref) => {
      setPaymentStatus("Payment Verification Successful");
      setPaymentSuccess(true);
      setPaymentVerified(true, ref);
      const payment = await recordPayment(ref);
      if (payment?.jobId) setDraftJobId(payment.jobId);
      setIsLoading(false);
    };

    if (redirectStatus) {
      onVerified(txRef || storedTxRef);
      return;
    }

    if (txRef) {
      api
        .get(`/api/chapa/verify?tx_ref=${encodeURIComponent(txRef)}`)
        .then(async ({ data }) => {
          if (data.status === "success") {
            await onVerified(txRef);
          } else {
            setPaymentStatus("Payment Verification Failed");
            setPaymentSuccess(false);
            setIsLoading(false);
          }
        })
        .catch(() => {
          setPaymentStatus("Error verifying payment");
          setPaymentSuccess(false);
          setIsLoading(false);
        });
      return;
    }

    setPaymentStatus("Payment Verification Failed. Please contact support.");
    setPaymentSuccess(false);
    setIsLoading(false);
  }, [searchParams, setPaymentVerified]); // eslint-disable-line react-hooks/exhaustive-deps

  if (user && user.role !== "company_admin") return <NotFoundPage />;

  const handlePublish = async () => {
    if (!draftJobId) {
      toast.error("Draft job not found. Check your dashboard or contact support.");
      navigate("/company/dashboard");
      return;
    }

    setPosting(true);
    try {
      await api.patch(`/api/jobs/${draftJobId}/publish`);
      toast.success("Job published successfully");
      resetPaymentStore();
      navigate("/company/dashboard");
    } catch {
      toast.error("Payment succeeded but publishing failed. You can publish from your dashboard.");
    } finally {
      setPosting(false);
    }
  };

  const handleSaveForLater = () => {
    toast.info("Job saved as draft. You can publish or edit it from your dashboard.");
    resetPaymentStore();
    navigate("/company/dashboard");
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
              <CheckCircleIcon className="text-5xl text-emerald-500" size={48} />
            )}
            {paymentSuccess === false && (
              <XCircleIcon className="text-5xl text-red-500" size={48} />
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
                ? "Your payment was successful. Publish now or save the job as a draft to finish later."
                : "We couldn't verify your payment."}
            </p>

            {paymentSuccess && pendingJob?.title && (
              <p className="text-sm text-gray-700 font-medium">Job: {pendingJob.title}</p>
            )}

            {paymentSuccess && draftJobId && (
              <p className="text-xs text-gray-500">A draft has been saved to your account.</p>
            )}

            {paymentSuccess && (
              <div className="flex flex-col gap-2 w-full">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={posting || !draftJobId}
                  className={Btn.full("primary", "py-3")}
                >
                  {posting ? "Publishing job…" : "Publish job"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveForLater}
                  className={Btn.full("secondary", "py-3")}
                >
                  Save as draft &amp; go to dashboard
                </button>
              </div>
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
