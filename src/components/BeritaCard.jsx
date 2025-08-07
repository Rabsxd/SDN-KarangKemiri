// src/components/BeritaCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORT INI

function BeritaCard({ id, judul, isi, tanggalPublikasi, gambarUrl }) { // <-- TAMBAHKAN 'id'

  const formatDate = (timestamp) => {
    // ... fungsi formatDate tidak berubah
    if (!timestamp) return 'Tanggal tidak tersedia';
    return timestamp.toDate().toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-8 transform hover:shadow-xl transition-shadow duration-300">
      <div className="md:w-1/3">
        <img src={gambarUrl || 'https://via.placeholder.com/800x600'} alt={`Gambar untuk ${judul}`} className="w-full h-56 md:h-full object-cover" />
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{judul}</h3>
          <p className="text-sm text-gray-500 mb-4">Dipublikasikan pada: {formatDate(tanggalPublikasi)}</p>
          <p className="text-gray-700 leading-relaxed">{isi.substring(0, 150)}{isi.length > 150 && '...'}</p>
        </div>
        <div className="mt-4">
          {/* UBAH DARI <a> MENJADI <Link> */}
          <Link to={`/berita/${id}`} className="text-sky-600 hover:text-sky-800 font-semibold">
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BeritaCard;