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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row mb-8 transform hover:shadow-xl transition-shadow duration-300">
      <div className="md:w-1/3">
        <img
          src={gambarUrl || "https://via.placeholder.com/800x600"}
          alt={`Gambar untuk ${judul}`}
          className="w-full h-56 md:h-full object-cover"
        />
      </div>
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{judul}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Dipublikasikan pada: {formatDate(tanggalPublikasi)}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {isi.substring(0, 150)}
            {isi.length > 150 && "..."}
          </p>
        </div>

        {/* BAGIAN BAWAH KARTU YANG DIPERBARUI */}
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/berita/${id}`}
            className="text-sky-600 hover:text-sky-800 font-semibold"
          >
            Baca Selengkapnya →
          </Link>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            title="Bagikan Berita"
          >
            {/* Ganti SVG dengan IMG */}
            <img src="/ikon-bagikan.png" alt="Bagikan" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeritaCard;
