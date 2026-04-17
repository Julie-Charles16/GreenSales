import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/auth/useAuth";

type Props = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PrivateRoute;