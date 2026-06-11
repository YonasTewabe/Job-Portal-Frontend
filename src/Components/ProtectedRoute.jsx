import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { readSession } from "../utils/session";
import NotFoundPage from "../Pages/NotFoundPage";

const ProtectedRoute = ({ children, roles }) => {
  const { user: ctxUser } = useAuth();
  const location = useLocation();

  // Fall back to reading storage directly in case React state hasn't
  // settled yet (e.g. immediately after login() before re-render)
  const user = ctxUser ?? readSession();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <NotFoundPage />;
  }

  return children;
};

export default ProtectedRoute;
