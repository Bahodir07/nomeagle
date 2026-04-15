import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isAuthChecked } = useAuth();
    const location = useLocation();

    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};