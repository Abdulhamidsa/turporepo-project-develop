import { Navigate } from 'react-router-dom';

import Auth from '../../../pages/auth';
import { useAuth } from '../../user/hooks/use.auth';

export function AuthOrRedirect() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Auth />;
}
