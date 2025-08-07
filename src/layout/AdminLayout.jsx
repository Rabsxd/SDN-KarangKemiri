// src/layout/AdminLayout.jsx
import React, { useState } from 'react'; // <-- Tambahkan useState
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

function AdminLayout() {
    const navigate = useNavigate();
    // State untuk mengontrol visibilitas sidebar di mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        // ... fungsi logout tidak berubah
        try {
            await signOut(auth);
            navigate('/login-admin');
        } catch (error) {
            console.error("Gagal logout:", error);
        }
    };

    // Kelas untuk link navigasi, menandai link yang aktif
    const navLinkClass = ({ isActive }) => 
        isActive 
          ? "bg-sky-600 text-white block w-full text-left px-3 py-2 rounded-md font-medium"
          : "text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md font-medium";

    return (
        <div className="relative min-h-screen md:flex">
            {/* Overlay untuk mobile (muncul saat sidebar terbuka) */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white w-64 p-4 flex-col h-screen fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex`}>
                <h2 className="text-2xl font-bold mb-8 text-center">Admin Menu</h2>
                <nav className="flex-grow space-y-2">
                    <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setSidebarOpen(false)}>Dashboard</NavLink>
                    <NavLink to="/admin/kelola-beranda" className={navLinkClass} onClick={() => setSidebarOpen(false)}>Kelola Beranda</NavLink>
                    <NavLink to="/admin/kelola-guru" className={navLinkClass} onClick={() => setSidebarOpen(false)}>Kelola Guru</NavLink>
                    <NavLink to="/admin/kelola-berita" className={navLinkClass} onClick={() => setSidebarOpen(false)}>Kelola Berita</NavLink>
                    <NavLink to="/admin/kelola-siswa" className={navLinkClass} onClick={() => setSidebarOpen(false)}>Kelola Siswa</NavLink>
                </nav>
                
                <div>
                    <hr className="border-gray-600 my-4" />
                    <a href="/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md font-medium mb-2">
                      🏠 Kembali ke Website
                    </a>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white block w-full text-left px-3 py-2 rounded-md font-bold">
                      🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Konten Utama */}
            <main className="flex-1 bg-gray-100">
                {/* Header Konten (hanya untuk tombol hamburger di mobile) */}
                <header className="p-4 bg-white shadow-md lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>
                
                {/* Outlet untuk merender halaman (KelolaGuru, dll.) */}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;