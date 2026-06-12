import CryptoJS from "crypto-js";
import { toast } from "./toast";
import api from "../axiosInterceptor";

/**
 * Initialize a Chapa payment session.
 * Encrypts payer details client-side, then calls the backend to start checkout.
 */
export const initializeChapaPayment = async ({
  amount,
  email,
  first_name,
  last_name,
  phone,
  onTxRef,
}) => {
  const tx_ref = `tx-${Date.now()}`;
  onTxRef?.(tx_ref);
  const callback_url = `${window.location.origin}/payment-success?tx_ref=${tx_ref}`;

  const payload = {
    amount,
    email,
    first_name,
    last_name,
    phone,
    tx_ref,
    currency: "ETB",
    callback_url,
    return_url: callback_url,
  };

  const encryptionKey = import.meta.env.VITE_CHAPA_ENCRYPTION_KEY;
  if (!encryptionKey) {
    toast.error("Encryption key is missing");
    return { success: false, tx_ref: null };
  }

  const encryptedPayload = CryptoJS.AES.encrypt(
    JSON.stringify(payload),
    encryptionKey
  ).toString();

  try {
    const { data } = await api.post("/api/chapa/initiate", {
      encrypted_data: encryptedPayload,
    });

    if (data.status === "success") {
      window.location.href = data.data.checkout_url;
      return { success: true, tx_ref };
    }

    toast.error(data.message || data.error || "Payment initialization failed");
    return { success: false, tx_ref: null };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error initializing Chapa payment";
    toast.error(message);
    return { success: false, tx_ref: null };
  }
};
