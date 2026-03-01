import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  console.log(user, location.pathname);
  if (user.login_inicial && location.pathname !== "/cambiarcontrasena") {
    return <Navigate to="/cambiarcontrasena" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
