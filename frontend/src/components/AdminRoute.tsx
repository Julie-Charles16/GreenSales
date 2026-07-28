import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

/** Empêche l'accès direct à l'administration sans rôle ADMIN. */
const AdminRoute = () => {
  const { user } = useAuth();

  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
