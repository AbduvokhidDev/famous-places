import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <p className="text-cyan-300">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
