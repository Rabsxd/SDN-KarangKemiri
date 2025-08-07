// src/pages/DaftarGuru.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
// PASTIKAN 'query' ADA DI SINI
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 
import GuruCard from '../components/GuruCard';

function DaftarGuru() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuru = async () => {
      setLoading(true);
      try {
        const guruCollectionRef = collection(db, 'guru');
        // Urutkan berdasarkan field 'urutan', lalu berdasarkan 'nama'
        const q = query(guruCollectionRef, orderBy("urutan", "asc"), orderBy("nama", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGuruList(data);
      } catch (error) {
        console.error("Gagal mengambil data guru:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuru();
  }, []);

  if (loading) {
    // Tambahkan sedikit style agar tulisan loading di tengah
    return <p className="text-center py-10 text-gray-500">Memuat data guru...</p>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Staf Pengajar & Karyawan
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tenaga pendidik profesional yang berdedikasi untuk mencerdaskan anak bangsa.
          </p>
        </div>
        
        <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {guruList.map(guru => (
            <GuruCard
              key={guru.id}
              nama={guru.nama}
              jabatan={guru.jabatan}
              fotoUrl={guru.fotoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DaftarGuru;