// src/pages/admin/KelolaSiswa.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';

// Style bisa disamakan atau dibuat sendiri
const styles = {
    container: { padding: '2rem' },
    form: { marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' },
    input: { padding: '0.5rem' },
    button: { padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
    cancelButton: { padding: '0.75rem', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' },
    list: { listStyle: 'none', padding: 0 },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' },
    actions: { display: 'flex', gap: '0.5rem' },
    actionButton: { padding: '0.5rem' },
    editButton: { backgroundColor: '#ffc107' },
    deleteButton: { backgroundColor: '#dc3545', color: 'white' }
};

function KelolaSiswa() {
    const [siswaList, setSiswaList] = useState([]);
    const [loading, setLoading] = useState(false);

    // State untuk form
    const [nama, setNama] = useState('');
    const [kelas, setKelas] = useState('');
    const [editingId, setEditingId] = useState(null);

    const siswaCollectionRef = collection(db, 'siswa');

    const fetchSiswa = async () => {
        setLoading(true);
        // Query untuk urutkan berdasarkan kelas, lalu berdasarkan nama
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
        if (!nama || !kelas) {
            alert("Nama dan Kelas wajib diisi.");
            return;
        }

        const data = { nama, kelas };

        if (editingId) {
            const siswaDoc = doc(db, 'siswa', editingId);
            await updateDoc(siswaDoc, data);
            alert("Data siswa berhasil diperbarui!");
        } else {
            await addDoc(siswaCollectionRef, data);
            alert("Siswa berhasil ditambahkan!");
        }

        handleCancelEdit();
        fetchSiswa();
    };

    return (
        <div style={styles.container}>
            <h2>Kelola Data Siswa</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h3>{editingId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
                <input style={styles.input} type="text" placeholder="Nama Lengkap Siswa" value={nama} onChange={(e) => setNama(e.target.value)} required />
                <input style={styles.input} type="text" placeholder="Kelas (contoh: Kelas 1, Kelas 2)" value={kelas} onChange={(e) => setKelas(e.target.value)} required />
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="submit" style={styles.button}>{editingId ? 'Update Siswa' : 'Tambah Siswa'}</button>
                    {editingId && <button type="button" style={styles.cancelButton} onClick={handleCancelEdit}>Batal Edit</button>}
                </div>
            </form>

            <h3>Daftar Siswa Saat Ini</h3>
            {loading ? <p>Memuat data...</p> : (
                <ul style={styles.list}>
                    {siswaList.map(siswa => (
                        <li key={siswa.id} style={styles.listItem}>
                            <span>{siswa.nama} - **{siswa.kelas}**</span>
                            <div style={styles.actions}>
                                <button style={{...styles.actionButton, ...styles.editButton}} onClick={() => handleStartEdit(siswa)}>Edit</button>
                                <button style={{...styles.actionButton, ...styles.deleteButton}} onClick={() => handleDelete(siswa.id)}>Hapus</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default KelolaSiswa;