import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProviderRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // If not logged in at all, send to provider entry/login
    return <Navigate to="/provider/entry" state={{ from: location }} replace />;
  }

  if (isAuthenticated && !user?.providerRole) {
    // If logged in as consumer, send to provider onboarding or entry
    return <Navigate to="/provider/entry" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
