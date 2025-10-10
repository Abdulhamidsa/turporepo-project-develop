import React, { useEffect, useState } from 'react';

import { Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // For now, we'll use a simple localStorage check
    // In a real implementation, this would verify JWT tokens and admin role
    const checkAdminStatus = () => {
      const isAdminLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
      setIsAdmin(isAdminLoggedIn);
      setIsChecking(false);
    };

    checkAdminStatus();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-red-600 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/signin" replace />;
  }

  return <>{children}</>;
}
