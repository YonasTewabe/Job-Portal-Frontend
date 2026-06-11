import { getDefaultRoute } from "./routes";

/** Pass when linking from the public landing page into auth flows */
export const publicAuthState = { fromPublic: true };

/** Redirect back to a path after login/signup */
export const loginRedirectState = (pathname) => ({ from: { pathname } });

/** Preserve redirect target and public-origin flag across auth pages */
export const preserveAuthRedirect = (location) => {
  const next = {};
  if (location.state?.fromPublic) next.fromPublic = true;
  if (location.state?.from) next.from = location.state.from;
  return Object.keys(next).length ? next : undefined;
};

/** @deprecated use preserveAuthRedirect */
export const preserveFromPublic = preserveAuthRedirect;

export const resolvePostAuthPath = (location, role) =>
  location.state?.from?.pathname ?? getDefaultRoute(role);
