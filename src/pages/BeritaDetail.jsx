// src/pages/BeritaDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams untuk membaca ID dari URL
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore'; // getDoc untuk mengambil satu dokumen

function BeritaDetail() {
    const { beritaId } = useParams(); // Mengambil ID dari URL, contoh: /berita/XYZ123
    const [artikel, setArtikel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtikel = async () => {
            setLoading(true);
            try {
                // Membuat referensi langsung ke dokumen spesifik di koleksi 'berita'
                const docRef = doc(db, 'berita', beritaId);
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
        if (!timestamp) return '';
        return timestamp.toDate().toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
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
                <Link to="/berita" className="text-sky-600 hover:text-sky-800 mb-8 inline-block">
                    &larr; Kembali ke semua berita
                </Link>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{artikel.judul}</h1>
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