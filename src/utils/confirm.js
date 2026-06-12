import Swal from "sweetalert2";

const dialogClass = {
  container: "app-dialog-container",
  popup: "app-dialog",
  title: "app-dialog-title",
  htmlContainer: "app-dialog-text",
  actions: "app-dialog-actions",
  confirmButton: "app-dialog-btn app-dialog-btn-confirm",
  cancelButton: "app-dialog-btn app-dialog-btn-cancel",
  input: "app-dialog-input",
  validationMessage: "app-dialog-validation",
  icon: "app-dialog-icon",
};

const baseOptions = {
  buttonsStyling: false,
  customClass: dialogClass,
  reverseButtons: true,
  showCancelButton: true,
  cancelButtonText: "Cancel",
  confirmButtonText: "Confirm",
  backdrop: "rgba(15, 23, 42, 0.42)",
  focusCancel: false,
};

/** Modern confirmation dialog */
export function confirm(options = {}) {
  return Swal.fire({ ...baseOptions, ...options });
}

export function confirmDelete({ title, text, confirmText = "Yes, delete" }) {
  return confirm({
    title,
    text,
    icon: "warning",
    confirmButtonText: confirmText,
    customClass: {
      ...dialogClass,
      confirmButton: "app-dialog-btn app-dialog-btn-danger",
    },
  });
}

export function confirmAction({ title, text, confirmText = "Confirm", icon = "question" }) {
  return confirm({
    title,
    text,
    icon,
    confirmButtonText: confirmText,
  });
}

export const showValidationMessage = (message) => Swal.showValidationMessage(message);
