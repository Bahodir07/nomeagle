import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/auth.store';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isAuthChecked } = useAuth();

    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};