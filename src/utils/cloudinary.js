// src/utils/cloudinary.js

// Ambil konfigurasi dari Environment Variables
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload gagal");
    }

    const data = await response.json();
    return data.secure_url; // Mengembalikan URL gambar yang aman
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};