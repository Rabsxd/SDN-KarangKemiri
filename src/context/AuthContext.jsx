// src/context/AuthContext.jsx
import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged adalah listener dari Firebase.
        // Dia akan berjalan saat pertama kali app load, dan setiap kali status login/logout berubah.
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe; // Cleanup listener saat komponen di-unmount
    }, []);

    const value = {
        currentUser
    };

    // Kita tidak akan merender aplikasi sampai proses pengecekan user selesai
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}