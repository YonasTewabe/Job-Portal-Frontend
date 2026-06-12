import { toast } from "./toast";
import axios from "../axiosInterceptor";

/** Strip the storage UUID prefix for display, e.g. "abc-...-resume.pdf" → "resume.pdf" */
export function formatCvDisplayName(filename) {
  if (!filename) return "";
  return filename.replace(/^[0-9a-f-]{36}-/i, "");
}

async function fetchApplicantCvBlob(filename) {
  const { data } = await axios.get(
    `/api/applicants/cv/${encodeURIComponent(filename)}`,
    { responseType: "blob" },
  );
  return new Blob([data], { type: "application/pdf" });
}

function cvErrorMessage(error) {
  if (error.response?.status === 404) return "CV file not found on the server";
  return "Could not load CV. Please try again.";
}

export async function openApplicantCv(filename) {
  if (!filename) {
    toast.error("No CV file available");
    return;
  }

  try {
    const blob = await fetchApplicantCvBlob(filename);
    const url = URL.createObjectURL(blob);
    const tab = window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => URL.revokeObjectURL(url), 120_000);
  } catch (error) {
    toast.error(cvErrorMessage(error));
  }
}

export async function downloadApplicantCv(filename) {
  if (!filename) {
    toast.error("No CV file available");
    return;
  }

  try {
    const blob = await fetchApplicantCvBlob(filename);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = formatCvDisplayName(filename) || "cv.pdf";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    toast.error(cvErrorMessage(error));
  }
}
