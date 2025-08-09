// src/pages/BeritaDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // useParams untuk membaca ID dari URL
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore"; // getDoc untuk mengambil satu dokumen

function BeritaDetail() {
  const { beritaId } = useParams(); // Mengambil ID dari URL, contoh: /berita/XYZ123
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtikel = async () => {
      setLoading(true);
      try {
        // Membuat referensi langsung ke dokumen spesifik di koleksi 'berita'
        const docRef = doc(db, "berita", beritaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArtikel({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Tidak ada dokumen seperti itu!");
        }
      } catch (error) {
        console.error("Error mengambil artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtikel();
  }, [beritaId]); // useEffect akan berjalan lagi jika beritaId berubah

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: artikel.judul,
      text: `Baca berita terbaru dari SD Negeri 1 Karangkemiri: ${artikel.judul}`,
      url: window.location.href, // URL halaman saat ini
    };

    try {
      // Cek apakah browser mendukung Web Share API
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Berita berhasil dibagikan");
      } else {
        // Fallback untuk browser yang tidak mendukung (misal: desktop)
        await navigator.clipboard.writeText(window.location.href);
        alert("Link berita berhasil disalin ke clipboard!");
      }
    } catch (error) {
      console.error("Error saat berbagi:", error);
    }
  };

  if (loading) {
    return <p className="text-center py-20">Memuat artikel...</p>;
  }

  if (!artikel) {
    return <p className="text-center py-20">Artikel tidak ditemukan.</p>;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/berita"
          className="text-sky-600 hover:text-sky-800 mb-8 inline-block"
        >
          &larr; Kembali ke semua berita
        </Link>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {artikel.judul}
          </h1>
          <button
            onClick={handleShare}
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            {/* Ganti SVG dengan IMG */}
            <img src="/ikon-bagikan.png" alt="Bagikan" className="w-5 h-5" />
            <span>Bagikan</span>
          </button>
        </div>

        <p className="text-gray-500 mb-6">
          Dipublikasikan pada: {formatDate(artikel.tanggalPublikasi)}
        </p>

        {artikel.gambarUrl && (
          <img
            src={artikel.gambarUrl}
            alt={artikel.judul}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
          />
        )}
        {/* Menggunakan whitespace-pre-wrap untuk menjaga format paragraf dari textarea */}
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {artikel.isi}
        </div>
      </div>
    </div>
  );
}

export default BeritaDetail;
