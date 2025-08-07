// src/pages/admin/KelolaHalamanUtama.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';

function KelolaHalamanUtama() {
    const [halamanData, setHalamanData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk semua field form
    const [heroJudul, setHeroJudul] = useState('');
    const [heroSubjudul, setHeroSubjudul] = useState('');
    const [sambutanTeks, setSambutanTeks] = useState('');
    const [sambutanNama, setSambutanNama] = useState('');
    const [fileGambarSekolah, setFileGambarSekolah] = useState(null);
    const [fileGambarGuru, setFileGambarGuru] = useState(null);

    const docRef = doc(db, 'pengaturan', 'halamanUtama');

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setHalamanData(data);
                // ISI SEMUA STATE FORM DENGAN DATA DARI FIRESTORE
                setHeroJudul(data.heroJudul || '');
                setHeroSubjudul(data.heroSubjudul || '');
                setSambutanTeks(data.sambutanTeks || '');
                setSambutanNama(data.sambutanNama || '');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let dataToUpdate = {
            heroJudul,
            heroSubjudul,
            sambutanTeks,
            sambutanNama,
        };

        try {
            if (fileGambarSekolah) {
                const url = await uploadToCloudinary(fileGambarSekolah);
                if(url) dataToUpdate.urlGambarSekolah = url;
            }
            if (fileGambarGuru) {
                const url = await uploadToCloudinary(fileGambarGuru);
                if(url) dataToUpdate.urlGambarGuruBersama = url;
            }

            await updateDoc(docRef, dataToUpdate);
            setHalamanData(prev => ({...prev, ...dataToUpdate}));
            alert('Data halaman utama berhasil diperbarui!');

        } catch (error) {
            console.error("Error updating data: ", error);
            alert('Gagal memperbarui data.');
        } finally {
            setIsSubmitting(false);
            setFileGambarSekolah(null);
            setFileGambarGuru(null);
            if(document.getElementById('gambar-sekolah-input')) document.getElementById('gambar-sekolah-input').value = null;
            if(document.getElementById('gambar-guru-input')) document.getElementById('gambar-guru-input').value = null;
        }
    };

    if (loading) {
        return <p className="p-8">Memuat data halaman utama...</p>;
    }

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Konten Halaman Utama</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                
                {/* Bagian Hero Banner */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Konten Hero Banner</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Judul Utama</label>
                            <input type="text" value={heroJudul} onChange={(e) => setHeroJudul(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Subjudul / Motto</label>
                            <input type="text" value={heroSubjudul} onChange={(e) => setHeroSubjudul(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                </div>

                <hr />

                {/* Bagian Sambutan */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Sambutan Kepala Sekolah</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Isi Sambutan</label>
                            <textarea value={sambutanTeks} onChange={(e) => setSambutanTeks(e.target.value)} rows="5" className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nama Kepala Sekolah</label>
                            <input type="text" value={sambutanNama} onChange={(e) => setSambutanNama(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                </div>
                
                <hr />

                {/* Bagian Gambar Sekolah */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Gambar Utama Sekolah (Hero)</h3>
                    <img src={halamanData?.urlGambarSekolah} alt="Preview Gambar Sekolah" className="w-full h-48 object-cover rounded-md mb-4" />
                    <label className="block text-sm font-medium text-gray-600">Ganti Gambar Sekolah</label>
                    <input id="gambar-sekolah-input" type="file" onChange={(e) => setFileGambarSekolah(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                </div>

                <hr />

                {/* Bagian Gambar Guru */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Gambar Guru Bersama</h3>
                    <img src={halamanData?.urlGambarGuruBersama} alt="Preview Gambar Guru Bersama" className="w-full h-48 object-cover rounded-md mb-4" />
                    <label className="block text-sm font-medium text-gray-600">Ganti Gambar Guru Bersama</label>
                    <input id="gambar-guru-input" type="file" onChange={(e) => setFileGambarGuru(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-sky-300 transition-colors">
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default KelolaHalamanUtama;