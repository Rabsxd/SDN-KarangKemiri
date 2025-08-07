// src/pages/admin/KelolaBerita.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';

function KelolaBerita() {
    const [beritaList, setBeritaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk form
    const [judul, setJudul] = useState('');
    const [isi, setIsi] = useState('');
    const [gambarFile, setGambarFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // State untuk paginasi
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const beritaCollectionRef = collection(db, 'berita');
    
    const fetchBerita = async () => {
        setLoading(true);
        const q = query(beritaCollectionRef, orderBy("tanggalPublikasi", "desc"));
        const data = await getDocs(q);
        setBeritaList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
    };

    useEffect(() => {
        fetchBerita();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus berita ini?")) {
            await deleteDoc(doc(db, 'berita', id));
            fetchBerita();
        }
    };

    const handleStartEdit = (berita) => {
        setEditingId(berita.id);
        setJudul(berita.judul);
        setIsi(berita.isi);
    };
    
    const handleCancelEdit = () => {
        setEditingId(null);
        setJudul('');
        setIsi('');
        setGambarFile(null);
        if(document.getElementById('gambar-input')) document.getElementById('gambar-input').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (editingId) {
            let gambarUrl = beritaList.find(b => b.id === editingId).gambarUrl;
            if (gambarFile) {
                gambarUrl = await uploadToCloudinary(gambarFile);
            }
            const beritaDoc = doc(db, 'berita', editingId);
            await updateDoc(beritaDoc, { judul, isi, gambarUrl });
        } else {
            let gambarUrl = '';
            if (gambarFile) {
                gambarUrl = await uploadToCloudinary(gambarFile);
            }
            await addDoc(beritaCollectionRef, { judul, isi, gambarUrl, tanggalPublikasi: new Date() });
        }
        handleCancelEdit();
        fetchBerita();
        setIsSubmitting(false);
    };

    // Logika Paginasi
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBeritaList = beritaList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(beritaList.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Data Berita</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                {/* FORM YANG HILANG SEBELUMNYA */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Judul Berita</label>
                        <input type="text" placeholder="Judul Berita" value={judul} onChange={(e) => setJudul(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Isi Berita</label>
                        <textarea placeholder="Isi Berita" value={isi} onChange={(e) => setIsi(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 min-h-[150px]"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Gambar (kosongkan jika tidak ingin mengubah)</label>
                        <input id="gambar-input" type="file" onChange={(e) => setGambarFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-sky-300 transition-colors">
                            {isSubmitting ? 'Menyimpan...' : (editingId ? 'Update Berita' : 'Tambah Berita')}
                        </button>
                        {editingId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">Batal Edit</button>}
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Daftar Berita Saat Ini</h3>
                {loading ? <p>Memuat data...</p> : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Gambar</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Judul</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Isi (Singkat)</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBeritaList.map(berita => (
                                        <tr key={berita.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">
                                                <img 
                                                    src={berita.gambarUrl || 'https://via.placeholder.com/150'} 
                                                    alt={berita.judul}
                                                    className="w-20 h-12 rounded-md object-cover"
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-800">{berita.judul}</td>
                                            <td className="p-3 text-gray-600">{berita.isi.substring(0, 50)}...</td>
                                            <td className="p-3 flex justify-center gap-2 items-center h-full">
                                                <button onClick={() => handleStartEdit(berita)} className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-sm">Edit</button>
                                                <button onClick={() => handleDelete(berita.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6 space-x-2">
                                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                                    Sebelumnya
                                </button>
                                <span className="text-sm text-gray-700">
                                    Halaman {currentPage} dari {totalPages}
                                </span>
                                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default KelolaBerita;