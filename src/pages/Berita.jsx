// src/pages/Berita.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import BeritaCard from '../components/BeritaCard';

function Berita() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // STATE BARU UNTUK PAGINASI
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Tampilkan 4 berita per halaman

  useEffect(() => {
    // Logika fetchBerita tidak berubah, tetap ambil semua data
    const fetchBerita = async () => {
      setLoading(true);
      try {
        const beritaCollectionRef = collection(db, 'berita');
        const q = query(beritaCollectionRef, orderBy("tanggalPublikasi", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBeritaList(data);
      } catch (error) {
        console.error("Error fetching berita: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBerita();
  }, []);

  // LOGIKA UNTUK MEMOTONG DATA SESUAI HALAMAN
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBerita = beritaList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(beritaList.length / itemsPerPage);

  // Fungsi untuk mengganti halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Memuat berita sekolah...</p>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Berita & Kegiatan Sekolah
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Informasi terbaru seputar kegiatan dan prestasi di lingkungan sekolah.
          </p>
        </div>
        
        <div>
          {currentBerita.length > 0 ? (
            // Gunakan 'currentBerita' untuk di-map, bukan 'beritaList' lagi
            currentBerita.map(berita => (
              <BeritaCard
                key={berita.id}
                id={berita.id}
                judul={berita.judul}
                isi={berita.isi}
                tanggalPublikasi={berita.tanggalPublikasi}
                gambarUrl={berita.gambarUrl}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Belum ada berita yang dipublikasikan.</p>
          )}
        </div>

        {/* BAGIAN BARU: TOMBOL PAGINASI */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Tombol Sebelumnya */}
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>

            {/* Tombol Nomor Halaman */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  currentPage === i + 1 
                    ? 'bg-sky-600 text-white border-sky-600' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Tombol Selanjutnya */}
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Berita;