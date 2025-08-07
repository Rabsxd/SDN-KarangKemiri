// src/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const layoutStyle = {
    minHeight: '100vh', // tinggi minimal 100% viewport
    display: 'flex',
    flexDirection: 'column'
}

function MainLayout() {
  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={{ flex: 1, padding: '1rem' }}>
        {/* Konten halaman dinamis akan dirender di sini */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;