// src/components/Navbar.jsx
import React, { useState } from "react"; // <-- Tambahkan useState
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  // State untuk melacak kondisi menu mobile (terbuka/tertutup)
  const [isOpen, setIsOpen] = useState(false);

  // Kelas untuk link navigasi, menandai link yang sedang aktif
  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-sky-600 text-white px-3 py-2 rounded-md text-sm font-medium"
      : "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

  // Kelas untuk link di menu mobile
  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "bg-sky-600 text-white block px-3 py-2 rounded-md text-base font-medium"
      : "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium";

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Bagian Kiri: Logo/Branding */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              SD Negeri 1 Karangkemiri
            </Link>
          </div>

          {/* Bagian Kanan: Menu Desktop (Tersembunyi di mobile) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={linkClass}>
                Beranda
              </NavLink>
              <NavLink to="/guru" className={linkClass}>
                Daftar Guru
              </NavLink>
              <NavLink to="/siswa" className={linkClass}>
                Daftar Siswa
              </NavLink>
              <NavLink to="/berita" className={linkClass}>
                Berita
              </NavLink>
              {/* Link Login sudah dihapus */}
            </div>
          </div>

          {/* Tombol Hamburger Menu (Hanya terlihat di mobile) */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Buka menu</span>
              {/* Ikon Hamburger (saat menu tertutup) dan Ikon X (saat menu terbuka) */}
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (Muncul/Hilang berdasarkan state 'isOpen') */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Beranda
          </NavLink>
          <NavLink
            to="/guru"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Daftar Guru
          </NavLink>
          <NavLink
            to="/siswa"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Daftar Siswa
          </NavLink>
          <NavLink
            to="/berita"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            Berita
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
