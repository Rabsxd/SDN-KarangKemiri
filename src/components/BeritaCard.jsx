// src/components/BeritaCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function BeritaCard({ id, judul, isi, tanggalPublikasi, gambarUrl }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "Tanggal tidak tersedia";
    return timestamp.toDate().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // FUNGSI BARU UNTUK BERBAGI
  const handleShare = async (e) => {
    e.preventDefault(); // Mencegah navigasi saat klik tombol share
    e.stopPropagation(); // Mencegah event "klik" menyebar ke elemen induk

    const shareData = {
      title: judul,
      text: `Baca berita terbaru dari SD Negeri 1 Karangkemiri: ${judul}`,
      // Kita buat URL manual karena kita tahu strukturnya
      url: `${window.location.origin}/berita/${id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link berita berhasil disalin ke clipboard!");
      }
    } catch (error) {
      console.error("Error saat berbagi:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden mb-6 transform hover:-translate-y-1">
      {/* Gambar dengan aspect ratio yang konsisten */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={gambarUrl || "https://via.placeholder.com/800x400"}
          alt={`Gambar untuk ${judul}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {/* Overlay gradient untuk readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Header dengan judul dan tanggal */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {judul}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Dipublikasikan pada {formatDate(tanggalPublikasi)}</span>
          </div>
        </div>

        {/* Konten preview */}
        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {isi.substring(0, 120)}
          {isi.length > 120 && "..."}
        </p>

        {/* Footer dengan tombol aksi */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to={`/berita/${id}`}
            className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold text-sm transition-colors duration-200"
          >
            <span>Baca Selengkapnya</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
            title="Bagikan Berita"
          >
            <img
              src="/ikon-bagikan.png"
              alt="Bagikan"
              className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeritaCard;
