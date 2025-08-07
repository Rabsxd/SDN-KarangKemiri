// src/components/GuruCard.jsx
import React from 'react';

function GuruCard({ nama, jabatan, fotoUrl }) {
  return (
    // Kita ubah sedikit struktur dan class-nya
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* BAGIAN GAMBAR */}
      <img
        src={fotoUrl || 'https://via.placeholder.com/400x400'} // Fallback jika URL foto tidak ada
        alt={`Foto ${nama}`}
        // Class di bawah ini adalah perubahannya
        className="w-full h-56 object-cover" 
      />
      
      {/* BAGIAN TEKS */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nama}</h3>
        <p className="text-gray-600 mt-1">{jabatan}</p>
      </div>
    </div>
  );
}

export default GuruCard;