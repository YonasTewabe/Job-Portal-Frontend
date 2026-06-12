import { toast as notify, Slide } from "react-toastify";

const defaults = {
  position: "top-right",
  autoClose: 3200,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 40,
  transition: Slide,
  className: "app-toast",
};

export const toast = {
  success: (message, options = {}) => notify.success(message, { ...defaults, ...options }),
  error: (message, options = {}) => notify.error(message, { ...defaults, ...options }),
  info: (message, options = {}) => notify.info(message, { ...defaults, ...options }),
  warn: (message, options = {}) => notify.warning(message, { ...defaults, ...options }),
  warning: (message, options = {}) => notify.warning(message, { ...defaults, ...options }),
};

export { ToastContainer, Slide } from "react-toastify";
