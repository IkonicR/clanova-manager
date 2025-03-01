
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // If still loading auth state, show nothing (or you could add a spinner here)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
