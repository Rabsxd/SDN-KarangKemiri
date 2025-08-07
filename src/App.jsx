// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layout/MainLayout';
import AdminLayout from './layout/AdminLayout'; // <-- IMPORT

// Components
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORT

// Public Pages
import Home from './pages/Home';
import DaftarGuru from './pages/DaftarGuru';
import DaftarSiswa from './pages/DaftarSiswa';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail'; 
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import Dashboard from './pages/admin/Dashboard'; // <-- IMPORT
import KelolaGuru from './pages/admin/KelolaGuru'; // <-- UBAH INI
import KelolaBerita from './pages/admin/KelolaBerita'; // <-- UBAH INI
import KelolaSiswa from './pages/admin/KelolaSiswa'
import KelolaHalamanUtama from './pages/admin/KelolaHalamanUtama';



function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="guru" element={<DaftarGuru />} />
        <Route path="siswa" element={<DaftarSiswa />} />
        <Route path="berita" element={<Berita />} />
        <Route path="berita/:beritaId" element={<BeritaDetail />} /> 
      </Route>
      <Route path="/login-admin" element={<AdminLogin />} />

      {/* Rute Admin yang Dilindungi */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="kelola-beranda" element={<KelolaHalamanUtama />} />
        <Route path="kelola-guru" element={<KelolaGuru />} />
        <Route path="kelola-berita" element={<KelolaBerita />} />
        <Route path="kelola-siswa" element={<KelolaSiswa />} />
      </Route>
    </Routes>
  );
}

export default App;