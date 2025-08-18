// src/components/GuruCard.jsx
import React from "react";

function GuruCard({ nama, jabatan, fotoUrl }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* BAGIAN GAMBAR - Menggunakan div dengan tinggi tetap dan overflow hidden */}
      <div className="w-full h-56 overflow-hidden">
        <img
          src={fotoUrl || "https://via.placeholder.com/400x400"}
          alt={`Foto ${nama}`}
          // Kembali ke object-center untuk pemusatan yang lebih seimbang
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* BAGIAN TEKS */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{nama}</h3>
        <p className="text-gray-600 mt-1">{jabatan}</p>
      </div>
    </div>
  );
}

export default GuruCard;
