import { Navigate } from 'react-router-dom';

import Auth from '../../../pages/auth';
import { useAuth } from '../../user/hooks/use.auth';

export function AuthOrRedirect() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    console.log('User is authenticated, redirecting to /feed from AuthOrRedirect');
    return <Navigate to="/feed" replace />;
  }
  return <Auth />;
}
