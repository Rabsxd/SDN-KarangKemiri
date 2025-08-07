// src/pages/admin/KelolaSiswa.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

function KelolaSiswa() {
    const [siswaList, setSiswaList] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk form
    const [nama, setNama] = useState('');
    const [kelas, setKelas] = useState('');
    const [editingId, setEditingId] = useState(null);

    const siswaCollectionRef = collection(db, 'siswa');

    // ... (Logika fetch, delete, edit, submit sama persis polanya)
    const fetchSiswa = async () => {
        setLoading(true);
        const q = query(siswaCollectionRef, orderBy("kelas"), orderBy("nama"));
        const data = await getDocs(q);
        setSiswaList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
    };

    useEffect(() => {
        fetchSiswa();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Yakin ingin menghapus data siswa ini?")) {
            await deleteDoc(doc(db, 'siswa', id));
            fetchSiswa();
        }
    };

    const handleStartEdit = (siswa) => {
        setEditingId(siswa.id);
        setNama(siswa.nama);
        setKelas(siswa.kelas);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNama('');
        setKelas('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { nama, kelas };
        if (editingId) {
            await updateDoc(doc(db, 'siswa', editingId), data);
        } else {
            await addDoc(siswaCollectionRef, data);
        }
        handleCancelEdit();
        fetchSiswa();
    };

    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Data Siswa</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">{editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nama Lengkap Siswa</label>
                            <input type="text" placeholder="Nama Siswa" value={nama} onChange={(e) => setNama(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Kelas</label>
                            <input type="text" placeholder="Contoh: Kelas 1, Kelas 2A" value={kelas} onChange={(e) => setKelas(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">{editingId ? 'Update Siswa' : 'Tambah Siswa'}</button>
                        {editingId && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">Batal Edit</button>}
                    </div>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Daftar Siswa Saat Ini</h3>
                {loading ? <p>Memuat data...</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Nama</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Kelas</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {siswaList.map(siswa => (
                                    <tr key={siswa.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{siswa.nama}</td>
                                        <td className="p-3 text-gray-600">{siswa.kelas}</td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button onClick={() => handleStartEdit(siswa)} className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-sm">Edit</button>
                                            <button onClick={() => handleDelete(siswa.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default KelolaSiswa;