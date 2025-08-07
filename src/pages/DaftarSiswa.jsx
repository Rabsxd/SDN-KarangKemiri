// src/pages/DaftarSiswa.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Kita tidak lagi butuh style inline

function DaftarSiswa() {
    const [siswaList, setSiswaList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSiswa = async () => {
            // Logika fetch data tidak berubah
            setLoading(true);
            try {
                const q = query(collection(db, 'siswa'), orderBy("kelas"), orderBy("nama"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSiswaList(data);
            } catch (error) {
                console.error("Error fetching siswa: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSiswa();
    }, []);

    // Logika untuk mengelompokkan siswa berdasarkan kelas tidak berubah
    const siswaByKelas = siswaList.reduce((acc, siswa) => {
        const { kelas } = siswa;
        if (!acc[kelas]) {
            acc[kelas] = [];
        }
        acc[kelas].push(siswa);
        return acc;
    }, {});

    if (loading) {
        return <p className="text-center py-10 text-gray-500">Memuat daftar siswa...</p>;
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Daftar Siswa Tahun Ajaran 2025/2026
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Generasi penerus bangsa yang cerdas dan berakhlak mulia.
                    </p>
                </div>
                
                <div className="space-y-12">
                    {Object.keys(siswaByKelas).sort().map(kelas => (
                        <div key={kelas} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-sky-700 border-b-2 border-sky-200 pb-2 mb-4">
                                {kelas}
                            </h3>
                            {/* PERUBAHAN UTAMA DI BARIS DI BAWAH INI */}
                            <ol className="list-decimal list-inside md:columns-2 lg:columns-3 xl:columns-4 gap-x-8">
                                {siswaByKelas[kelas].map(siswa => (
                                    <li key={siswa.id} className="text-gray-800 text-lg mb-2 break-inside-avoid">
                                        {siswa.nama}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DaftarSiswa;