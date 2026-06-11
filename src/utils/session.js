import Cookies from "js-cookie";

export const COOKIE_OPTS = { expires: 1, sameSite: "strict" };

/**
 * Read the current session from cookies / localStorage.
 * Returns null if any required field is missing.
 */
export const readSession = () => {
  const jwt    = Cookies.get("jwt");
  const userId = Cookies.get("userId");
  const role   = localStorage.getItem("role");
  if (!jwt || !userId || !role) return null;
  return {
    jwt,
    userId,
    name:      localStorage.getItem("name") ?? "",
    email:     localStorage.getItem("email") ?? "",
    role,
    companyId: localStorage.getItem("companyId") || null,
  };
};

/**
 * Persist the login response from the backend.
 * Expected fields: jwt, userId, name, role, companyId (nullable)
 */
export const writeSession = (data) => {
  Cookies.set("jwt",    data.jwt,    COOKIE_OPTS);
  Cookies.set("userId", data.userId, COOKIE_OPTS);
  localStorage.setItem("name",      data.name  ?? "");
  localStorage.setItem("email",     data.email ?? "");
  localStorage.setItem("role",      data.role);
  localStorage.setItem("companyId", data.companyId ?? "");
};

export const patchSession = (fields) => {
  if (fields.name != null)      localStorage.setItem("name", fields.name);
  if (fields.email != null)     localStorage.setItem("email", fields.email);
  if (fields.companyId != null) localStorage.setItem("companyId", fields.companyId ?? "");
};

export const clearSession = () => {
  Cookies.remove("jwt");
  Cookies.remove("userId");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("companyId");
};
