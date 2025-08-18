// src/pages/DaftarGuru.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import GuruCard from "../components/GuruCard";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "../utils/animations";

function DaftarGuru() {
  const [guruAktif, setGuruAktif] = useState([]);
  const [guruPensiun, setGuruPensiun] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("aktif"); // State untuk tab aktif

  useEffect(() => {
    const fetchGuru = async () => {
      setLoading(true);
      try {
        // Query untuk guru aktif
        const qAktif = query(
          collection(db, "guru"),
          where("status", "==", "aktif"),
          orderBy("urutan", "asc")
        );
        const guruAktifSnap = await getDocs(qAktif);
        setGuruAktif(
          guruAktifSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        // Query untuk guru pensiun
        const qPensiun = query(
          collection(db, "guru"),
          where("status", "==", "pensiun"),
          orderBy("nama", "asc")
        );
        const guruPensiunSnap = await getDocs(qPensiun);
        setGuruPensiun(
          guruPensiunSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Gagal mengambil data guru:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuru();
  }, []);

  const guruToDisplay = activeTab === "aktif" ? guruAktif : guruPensiun;

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">Memuat data guru...</p>
    );
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
            Tenaga pendidik profesional yang berdedikasi untuk mencerdaskan anak
            bangsa.
          </p>
        </motion.div>

        {/* Navigasi Tab */}
        <div className="mt-8 border-b border-gray-200">
          <nav
            className="-mb-px flex justify-center space-x-8"
            aria-label="Tabs"
          >
            <button
              onClick={() => setActiveTab("aktif")}
              className={`${
                activeTab === "aktif"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Guru Aktif
            </button>
            <button
              onClick={() => setActiveTab("pensiun")}
              className={`${
                activeTab === "pensiun"
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Guru Pensiun
            </button>
          </nav>
        </div>

        <motion.div
          key={activeTab} // Kunci unik untuk memicu animasi ulang saat tab berganti
          className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {guruToDisplay.length > 0 ? (
            guruToDisplay.map((guru) => (
              <motion.div key={guru.id} variants={fadeInUp}>
                <GuruCard
                  nama={guru.nama}
                  jabatan={guru.jabatan}
                  fotoUrl={guru.fotoUrl}
                />
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-8">
              Tidak ada data untuk ditampilkan di kategori ini.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DaftarGuru;
