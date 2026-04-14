import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  token: string | null;
};

const PrivateRoute = ({ children, token }: Props) => {
  if (!token) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default PrivateRoute;