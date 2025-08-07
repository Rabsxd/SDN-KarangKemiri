// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        // Jika tidak ada user yang login, "lempar" ke halaman login
        return <Navigate to="/login-admin" />;
    }

    // Jika ada user yang login, izinkan akses ke halaman
    return children;
}

export default ProtectedRoute;