import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/model/useAuth";
import Loader from "../../shared/components/Loader";

export function ProtectedRoutes({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullscreen text="Verificando sesión..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}