// src/pages/admin/KelolaGuru.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { uploadToCloudinary } from "../../utils/cloudinary";

function KelolaGuru() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [fotoFile, setFotoFile] = useState(null);
  const [urutan, setUrutan] = useState(null);
  const [editingId, setEditingId] = useState(null);
  // ... state lainnya
  const [status, setStatus] = useState("aktif"); // Default status adalah aktif
  const [hapusFoto, setHapusFoto] = useState(false); // State untuk hapus foto
  const [currentFotoUrl, setCurrentFotoUrl] = useState(""); // State untuk foto saat ini
  const [previewUrl, setPreviewUrl] = useState(""); // State untuk preview foto baru

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const guruCollectionRef = collection(db, "guru");

  const fetchGuru = async () => {
    setLoading(true);
    const q = query(
      guruCollectionRef,
      orderBy("urutan", "asc"),
      orderBy("nama", "asc")
    );
    const data = await getDocs(q);
    setGuruList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      await deleteDoc(doc(db, "guru", id));
      fetchGuru();
    }
  };

  const handleStartEdit = (guru) => {
    setEditingId(guru.id);
    setNama(guru.nama);
    setJabatan(guru.jabatan);
    setUrutan(guru.urutan || 10);
    setStatus(guru.status || "aktif");
    setCurrentFotoUrl(guru.fotoUrl || "");
    setHapusFoto(false);
    setPreviewUrl("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNama("");
    setJabatan("");
    setUrutan(10);
    setStatus("aktif");
    setFotoFile(null);
    setHapusFoto(false);
    setCurrentFotoUrl("");
    setPreviewUrl("");
    if (document.getElementById("foto-input"))
      document.getElementById("foto-input").value = null;
  };

  const handleHapusFoto = () => {
    setHapusFoto(true);
    setFotoFile(null);
    setPreviewUrl("");
    if (document.getElementById("foto-input"))
      document.getElementById("foto-input").value = null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setHapusFoto(false); // Reset hapus foto jika user pilih foto baru

      // Buat preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFotoFile(null);
      setPreviewUrl("");
    }
  };

  const handleRemovePreview = () => {
    setFotoFile(null);
    setPreviewUrl("");
    if (document.getElementById("foto-input"))
      document.getElementById("foto-input").value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSave = { nama, jabatan, urutan: Number(urutan), status };
    if (editingId) {
      let fotoUrlToUpdate = guruList.find((g) => g.id === editingId).fotoUrl;

      if (hapusFoto) {
        // Jika foto akan dihapus
        fotoUrlToUpdate = "";
      } else if (fotoFile) {
        // Jika ada foto baru yang diupload
        fotoUrlToUpdate = await uploadToCloudinary(fotoFile);
      }
      // Jika tidak ada perubahan foto, gunakan foto yang sudah ada

      dataToSave.fotoUrl = fotoUrlToUpdate;
      await updateDoc(doc(db, "guru", editingId), dataToSave);
    } else {
      let fotoUrl = "";
      if (fotoFile) {
        fotoUrl = await uploadToCloudinary(fotoFile);
      }
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Kelola Data Guru
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          {editingId ? "Edit Data Guru" : "Tambah Guru Baru"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Nomor Urut
              </label>
              <input
                type="number"
                placeholder="1"
                value={urutan}
                onChange={(e) => setUrutan(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Jabatan
            </label>
            <input
              type="text"
              placeholder="Jabatan"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="aktif">Aktif</option>
              <option value="pensiun">Pensiun</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Foto {editingId ? "(kosongkan jika tidak ingin mengubah)" : ""}
            </label>

            {/* Tampilkan foto saat ini jika sedang edit dan ada foto */}
            {editingId && currentFotoUrl && !hapusFoto && !previewUrl && (
              <div className="mt-2 mb-3">
                <p className="text-sm text-gray-500 mb-2">Foto saat ini:</p>
                <div className="flex items-start gap-3">
                  <img
                    src={currentFotoUrl}
                    alt="Foto saat ini"
                    className="w-20 h-20 rounded-md object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleHapusFoto}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            )}

            {/* Preview foto baru */}
            {previewUrl && (
              <div className="mt-2 mb-3">
                <p className="text-sm text-gray-500 mb-2">
                  {editingId ? "Preview foto baru:" : "Preview foto:"}
                </p>
                <div className="flex items-start gap-3">
                  <img
                    src={previewUrl}
                    alt="Preview foto"
                    className="w-20 h-20 rounded-md object-cover border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePreview}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Hapus Preview
                  </button>
                </div>
              </div>
            )}

            {/* Pesan jika foto akan dihapus */}
            {hapusFoto && (
              <div className="mt-2 mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Foto akan dihapus saat menyimpan perubahan.
                </p>
                <button
                  type="button"
                  onClick={() => setHapusFoto(false)}
                  className="mt-1 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Batalkan hapus foto
                </button>
              </div>
            )}

            {/* Placeholder jika tidak ada foto (tambah guru baru atau edit tanpa foto) */}
            {!editingId && !previewUrl && (
              <div className="mt-2 mb-3">
                <div className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="w-6 h-6 text-gray-400 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-xs text-gray-400">Pilih foto</p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder untuk edit guru tanpa foto */}
            {editingId && !currentFotoUrl && !previewUrl && !hapusFoto && (
              <div className="mt-2 mb-3">
                <p className="text-sm text-gray-500 mb-2">Belum ada foto</p>
                <div className="w-20 h-20 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="w-6 h-6 text-gray-400 mx-auto mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-xs text-gray-400">Tambah foto</p>
                  </div>
                </div>
              </div>
            )}

            <input
              id="foto-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />

            {/* Info tambahan */}
            <p className="mt-1 text-xs text-gray-500">
              Format yang didukung: JPG, PNG, GIF. Maksimal 5MB.
            </p>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-sky-300 transition-colors"
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                ? "Update Guru"
                : "Tambah Guru"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Daftar Guru Saat Ini
        </h3>
        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Foto
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Urutan
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Nama
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600">
                      Jabatan
                    </th>
                    <th className="p-3 text-sm font-semibold text-gray-600 text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGuruList.map((guru) => (
                    <tr key={guru.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <img
                          src={
                            guru.fotoUrl || "https://via.placeholder.com/150"
                          }
                          alt={guru.nama}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3">{guru.urutan}</td>
                      <td className="p-3 font-medium text-gray-800">
                        {guru.nama}
                      </td>
                      <td className="p-3 text-gray-600">{guru.jabatan}</td>
                      <td className="p-3 flex justify-center gap-2 items-center h-full">
                        <button
                          onClick={() => handleStartEdit(guru)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guru.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-gray-700">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
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
