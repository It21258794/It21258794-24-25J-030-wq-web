import React, { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export const PrivateGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('PrivateGuard must be used within an AuthProvider');
  }

  const { user } = authContext;
  if (user) {
    return <>{children}</>;
  }

  return <Navigate to="/" replace />;
};

export const GuestGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('GuestGuard must be used within an AuthProvider');
  }

  const { user } = authContext;

  if (user) {
    return <Navigate to="/user/waterQualityDashboard" replace />;
  }

  return <>{children}</>;
};