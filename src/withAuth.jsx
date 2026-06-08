/**
 * withAuth — kept for backward compatibility with pages that still use it.
 * New code should use <ProtectedRoute> in the router instead.
 *
 * This simply wraps the component so it renders only when the user is
 * authenticated, delegating the actual check to useAuth().
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Spinner from "./Components/Spinner";

const withAuth = (WrappedComponent) => {
  const HocComponent = (props) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    }, [user, navigate]);

    if (!user) {
      return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };

  HocComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;
  return HocComponent;
};

export default withAuth;
