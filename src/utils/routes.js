/** Default post-login destination per role */
export const getDefaultRoute = (role) => {
  switch (role) {
    case "superadmin":
      return "/superadmin/dashboard";
    case "company_admin":
      return "/company/dashboard";
    case "user":
      return "/dashboard";
    case "admin":
      return "/home";
    case "hr":
      return "/home";
    default:
      return "/home";
  }
};
