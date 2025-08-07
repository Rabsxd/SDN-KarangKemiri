// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion'; // <-- Import motion

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError("Email atau password salah. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    // URL Gambar Ilustrasi
    const illustrationUrl = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2940&auto=format&fit=crop';

    return (
        <div className="flex items-stretch min-h-screen bg-white">
            {/* Kolom Kiri: Form Login */}
            <motion.div 
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
                    <p className="text-gray-500 mb-8">Silakan login untuk mengelola website.</p>
                    
                    <form onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@sekolah.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password"className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-lg font-bold hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Kolom Kanan: Gambar Ilustrasi (Tersembunyi di mobile) */}
            <motion.div 
                className="hidden lg:block lg:w-1/2 bg-cover bg-center"
                style={{ backgroundImage: `url(${illustrationUrl})` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <div className="w-full h-full bg-black bg-opacity-20"></div>
            </motion.div>
        </div>
    );
}

export default AdminLogin;