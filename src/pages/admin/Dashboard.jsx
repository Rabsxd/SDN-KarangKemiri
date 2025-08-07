// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function StatCard({ title, value, linkTo }) {
    return (
        <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
        </Link>
    );
}

function Dashboard() {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ guru: 0, berita: 0, siswa: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const guruPromise = getDocs(collection(db, 'guru'));
                const beritaPromise = getDocs(collection(db, 'berita'));
                const siswaPromise = getDocs(collection(db, 'siswa'));

                const [guruSnap, beritaSnap, siswaSnap] = await Promise.all([guruPromise, beritaPromise, siswaPromise]);

                setStats({
                    guru: guruSnap.size,
                    berita: beritaSnap.size,
                    siswa: siswaSnap.size,
                });
            } catch (error) {
                console.error("Gagal mengambil statistik:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);
    
    return (
        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Selamat Datang, Admin!</h2>
            <p className="text-gray-600 mb-8">
                Anda login sebagai: <span className="font-semibold text-sky-600">{currentUser?.email}</span>
            </p>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <p>Memuat statistik...</p>
                ) : (
                    <>
                        <StatCard title="Jumlah Guru Terdaftar" value={stats.guru} linkTo="/admin/kelola-guru" />
                        <StatCard title="Jumlah Berita" value={stats.berita} linkTo="/admin/kelola-berita" />
                        <StatCard title="Jumlah Siswa Terdaftar" value={stats.siswa} linkTo="/admin/kelola-siswa" />
                    </>
                )}
            </div>
            
            {/* <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Akses Cepat</h3>
                <div className="flex flex-wrap gap-4">
                    <Link to="/admin/kelola-guru" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">Kelola Guru</Link>
                    <Link to="/admin/kelola-berita" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">Kelola Berita</Link>
                    <Link to="/admin/kelola-siswa" className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors">Kelola Siswa</Link>
                </div>
            </div> */}
        </div>
    );
}

export default Dashboard;