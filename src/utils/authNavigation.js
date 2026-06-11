/** Pass when linking from the public landing page into auth flows */
export const publicAuthState = { fromPublic: true };

/** Preserve public-origin flag when moving between auth pages */
export const preserveFromPublic = (location) =>
  location.state?.fromPublic ? publicAuthState : undefined;
