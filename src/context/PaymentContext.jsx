import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "payment-storage";

const defaultPayerInfo = {
  paymentPersonName: "",
  paymentPersonEmail: "",
  paymentPersonPhoneNumber: "",
};

const defaultState = {
  amount: 0,
  currency: "ETB",
  pendingJob: null,
  payerInfo: defaultPayerInfo,
  paymentVerified: false,
  txRef: null,
};

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      payerInfo: { ...defaultPayerInfo, ...parsed?.payerInfo },
    };
  } catch {
    return defaultState;
  }
}

function persistState(state) {
  const { amount, currency, pendingJob, payerInfo, paymentVerified, txRef } = state;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ amount, currency, pendingJob, payerInfo, paymentVerified, txRef })
  );
}

const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [state, setState] = useState(loadStoredState);

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      persistState(next);
      return next;
    });
  }, []);

  const setPendingJob = useCallback(
    (pendingJob, pricing) =>
      updateState((prev) => ({
        ...prev,
        pendingJob,
        amount: pricing?.jobPostingPrice != null ? Number(pricing.jobPostingPrice) : prev.amount,
        currency: pricing?.currency ?? prev.currency ?? "ETB",
      })),
    [updateState]
  );

  const setPayerInfo = useCallback(
    (data) => updateState((prev) => ({ ...prev, payerInfo: { ...prev.payerInfo, ...data } })),
    [updateState]
  );

  const setTxRef = useCallback((txRef) => updateState({ txRef }), [updateState]);

  const setPaymentVerified = useCallback(
    (paymentVerified, txRef = null) => updateState({ paymentVerified, txRef }),
    [updateState]
  );

  const resetPaymentStore = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setPendingJob,
      setPayerInfo,
      setTxRef,
      setPaymentVerified,
      resetPaymentStore,
    }),
    [state, setPendingJob, setPayerInfo, setTxRef, setPaymentVerified, resetPaymentStore]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within PaymentProvider");
  return ctx;
};
