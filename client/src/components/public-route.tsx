import { Navigate } from "react-router-dom";
import { getAccessToken } from "@/utils/storage";

type PublicRouteProps = {
  children: React.ReactNode;
};

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const token = getAccessToken();

  if (token) {
    return <Navigate to="/dashboard/home" replace />;
  }

  return <>{children}</>;
};
