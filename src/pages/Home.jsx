// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from 'firebase/firestore';

import GuruCard from '../components/GuruCard';
import BeritaCard from '../components/BeritaCard';
import { staggerContainer, fadeInUp } from '../utils/animations.js';

function Home() {
    // State dan logika useEffect tidak ada perubahan sama sekali
    const [halamanData, setHalamanData] = useState(null);
    const [guruPreview, setGuruPreview] = useState([]);
    const [beritaPreview, setBeritaPreview] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllHomeData = async () => {
            setLoading(true);
            try {
                const pengaturanPromise = getDoc(doc(db, 'pengaturan', 'halamanUtama'));
                const guruQuery = query(collection(db, 'guru'), orderBy("urutan", "asc"), limit(3));
                const guruPromise = getDocs(guruQuery);
                const beritaQuery = query(collection(db, 'berita'), orderBy("tanggalPublikasi", "desc"), limit(3));
                const beritaPromise = getDocs(beritaQuery);

                const [pengaturanSnap, guruSnap, beritaSnap] = await Promise.all([pengaturanPromise, guruPromise, beritaPromise]);

                if (pengaturanSnap.exists()) {
                    setHalamanData(pengaturanSnap.data());
                } else {
                    setHalamanData({
                        urlGambarSekolah: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=2832&auto=format&fit=crop',
                        urlGambarGuruBersama: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2940&auto=format&fit=crop'
                    });
                }
                setGuruPreview(guruSnap.docs.map(d => ({ id: d.id, ...d.data() })));
                setBeritaPreview(beritaSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            } catch (error) {
                console.error("Gagal mengambil data halaman utama:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllHomeData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center"><p>Memuat halaman...</p></div>;
    }

    return (
        <div>
            {/* 1. Hero Section (Welcome Banner) */}
            <div 
                className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center" 
                style={{ backgroundImage: `url(${halamanData?.urlGambarSekolah})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <motion.div 
                    className="relative text-center text-white p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                        {/* Tampilkan judul dari state */}
                        {halamanData?.heroJudul}
                    </h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto">
                        {/* Tampilkan subjudul dari state */}
                        {halamanData?.heroSubjudul}
                    </p>
                </motion.div>
            </div>

            {/* 2. Seksi Sambutan Kepala Sekolah */}
             <div className="py-20 px-4 text-center bg-white">
                <motion.div 
                    className="max-w-4xl mx-auto"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Sambutan Kepala Sekolah</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {/* Tampilkan teks dari state */}
                        "{halamanData?.sambutanTeks}"
                    </p>
                    <p className="mt-4 font-semibold text-gray-800">
                        {/* Tampilkan nama dari state */}
                        - {halamanData?.sambutanNama} -
                    </p>
                </motion.div>
            </div>

            {/* 3. Seksi Tim Pengajar Kami (Foto Bersama) */}
            <div className="py-20 px-4 bg-gray-50 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Tim Pengajar Kami</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Kami bangga memiliki tim pendidik yang solid, berdedikasi, dan siap membimbing putra-putri Anda menuju masa depan yang cerah.
                        </p>
                    </motion.div>
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        src={halamanData.urlGambarGuruBersama} 
                        alt="Foto bersama guru-guru" 
                        className="rounded-lg shadow-xl w-full h-auto object-cover"
                    />
                </div>
            </div>

            {/* 4. SEKSI PREVIEW GURU */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2 variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl font-extrabold text-gray-900">
                        Staf Pengajar Unggulan
                    </motion.h2>
                    <motion.div 
                        className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {guruPreview.map(guru => (
                            <motion.div key={guru.id} variants={fadeInUp}>
                                <GuruCard {...guru} />
                            </motion.div>
                        ))}
                    </motion.div>
                    <Link 
                        to="/guru" 
                        className="mt-12 inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Lihat Semua Guru & Staf
                    </Link>
                </div>
            </div>

            {/* 5. SEKSI PREVIEW BERITA */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2 variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl font-extrabold text-gray-900">
                        Berita & Kegiatan Terbaru
                    </motion.h2>
                    <motion.div
                        className="mt-10 space-y-12"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {beritaPreview.map(berita => (
                            <motion.div key={berita.id} variants={fadeInUp}>
                                <BeritaCard {...berita} />
                            </motion.div>
                        ))}
                    </motion.div>
                    <Link 
                        to="/berita" 
                        className="mt-12 inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;