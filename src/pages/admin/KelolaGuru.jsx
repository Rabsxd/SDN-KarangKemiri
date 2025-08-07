// src/pages/admin/KelolaGuru.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { uploadToCloudinary } from '../../utils/cloudinary';

function KelolaGuru() {
    const [guruList, setGuruList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [nama, setNama] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [fotoFile, setFotoFile] = useState(null);
    const [urutan, setUrutan] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const guruCollectionRef = collection(db, 'guru');

    const fetchGuru = async () => {
        setLoading(true);
        const q = query(guruCollectionRef, orderBy("urutan", "asc"), orderBy("nama", "asc"));
        const data = await getDocs(q);
        setGuruList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
    };

    useEffect(() => {
        fetchGuru();
    }, []);
    
    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
            await deleteDoc(doc(db, 'guru', id));
            fetchGuru();
        }
    };

    const handleStartEdit = (guru) => {
        setEditingId(guru.id);
        setNama(guru.nama);
        setJabatan(guru.jabatan);
        setUrutan(guru.urutan || 10);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNama('');
        setJabatan('');
        setUrutan(10);
        setFotoFile(null);
        if(document.getElementById('foto-input')) document.getElementById('foto-input').value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSave = { nama, jabatan, urutan: Number(urutan) };
        if (editingId) {
            let fotoUrlToUpdate = guruList.find(g => g.id === editingId).fotoUrl;
            if (fotoFile) { fotoUrlToUpdate = await uploadToCloudinary(fotoFile); }
            dataToSave.fotoUrl = fotoUrlToUpdate;
            await updateDoc(doc(db, 'guru', editingId), dataToSave);
        } else {
            let fotoUrl = '';
            if (fotoFile) { fotoUrl = await uploadToCloudinary(fotoFile); }
            dataToSave.fotoUrl = fotoUrl;
            await addDoc(guruCollectionRef, dataToSave);
        }
        handleCancelEdit();
        fetchGuru();
        setIsSubmitting(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGuruList = guruList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(guruList.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Data Guru</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                 <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? 'Edit Data Guru' : 'Tambah Guru Baru'}</h3>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <label className="block text-sm font-medium text-gray-600">Nomor Urut</label>
                             <input type="number" placeholder="1" value={urutan} onChange={(e) => setUrutan(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-600">Nama Lengkap</label>
                             <input type="text" placeholder="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                         </div>
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-600">Jabatan</label>
                         <input type="text" placeholder="Jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-600">Foto (kosongkan jika tidak ingin mengubah)</label>
                         <input id="foto-input" type="file" onChange={(e) => setFotoFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100" />
                     </div>
                     <div className="flex gap-4 pt-2">
                         <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-sky-300 transition-colors">
                             {isSubmitting ? 'Menyimpan...' : (editingId ? 'Update Guru' : 'Tambah Guru')}
                         </button>
                         {editingId && (
                             <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                                 Batal Edit
                             </button>
                         )}
                     </div>
                 </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Daftar Guru Saat Ini</h3>
                {loading ? <p>Memuat data...</p> : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Foto</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Urutan</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Nama</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600">Jabatan</th>
                                        <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentGuruList.map(guru => (
                                        <tr key={guru.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">
                                                <img 
                                                    src={guru.fotoUrl || 'https://via.placeholder.com/150'} 
                                                    alt={guru.nama}
                                                    className="w-12 h-12 rounded-md object-cover"
                                                />
                                            </td>
                                            <td className="p-3">{guru.urutan}</td>
                                            <td className="p-3 font-medium text-gray-800">{guru.nama}</td>
                                            <td className="p-3 text-gray-600">{guru.jabatan}</td>
                                            <td className="p-3 flex justify-center gap-2 items-center h-full">
                                                <button onClick={() => handleStartEdit(guru)} className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-sm">Edit</button>
                                                <button onClick={() => handleDelete(guru.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Hapus</button>
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

export default KelolaGuru;