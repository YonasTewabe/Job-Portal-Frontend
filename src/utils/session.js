import Cookies from "js-cookie";

export const COOKIE_OPTS = { expires: 1, sameSite: "strict" };

export const readSession = () => {
  const jwt = Cookies.get("jwt");
  const userId = Cookies.get("userId");
  const role = localStorage.getItem("role");
  if (!jwt || !userId || !role) return null;
  return {
    jwt,
    userId,
    role,
    usercompleted: localStorage.getItem("usercompleted") === "true",
    hrcompleted: localStorage.getItem("hrcompleted") === "true",
    hrStatus: localStorage.getItem("hrStatus"),
  };
};

export const writeSession = (data) => {
  Cookies.set("jwt", data.jwt, COOKIE_OPTS);
  Cookies.set("userId", data.profileId, COOKIE_OPTS);
  localStorage.setItem("role", data.role);
  localStorage.setItem("usercompleted", String(data.usercompleted));
  localStorage.setItem("hrcompleted", String(data.hrcompleted));
  localStorage.setItem("hrStatus", data.hrStatus ?? "");
};

export const clearSession = () => {
  Cookies.remove("jwt");
  Cookies.remove("userId");
  Cookies.remove("jobId");
  localStorage.removeItem("role");
  localStorage.removeItem("usercompleted");
  localStorage.removeItem("hrcompleted");
  localStorage.removeItem("hrStatus");
};
