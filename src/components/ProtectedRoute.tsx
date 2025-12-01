import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/AuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, admin } = useAuthStore();

  if (!token || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
