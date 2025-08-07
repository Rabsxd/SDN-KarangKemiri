// src/pages/DaftarGuru.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import GuruCard from '../components/GuruCard';
import { motion } from 'framer-motion'; // <-- IMPORT motion
import { staggerContainer, fadeInUp } from '../utils/animations'; // <-- IMPORT animasi

function DaftarGuru() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuru = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'guru'), orderBy("urutan", "asc"), orderBy("nama", "asc"));
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
    return <p className="text-center py-10 text-gray-500">Memuat data guru...</p>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Staf Pengajar & Karyawan
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tenaga pendidik profesional yang berdedikasi untuk mencerdaskan anak bangsa.
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {guruList.map(guru => (
            <motion.div key={guru.id} variants={fadeInUp}>
              <GuruCard
                nama={guru.nama}
                jabatan={guru.jabatan}
                fotoUrl={guru.fotoUrl}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default DaftarGuru;