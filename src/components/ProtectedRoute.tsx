
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - Auth State:", { user, loading });

  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clan-accent mx-auto"></div>
          <p className="mt-4">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    console.log("ProtectedRoute - Redirecting to login");
    return <Navigate to="/login" />;
  }

  // If user is logged in, show the protected content
  console.log("ProtectedRoute - Showing protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
