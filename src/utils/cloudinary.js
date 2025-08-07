export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "profil-sekolah-unsigned"); // GANTI DENGAN NAMA PRESET-MU
  formData.append("cloud_name", "dqxub9upe"); // GANTI DENGAN CLOUD NAME-MU

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${"dqxub9upe"}/image/upload`, // GANTI DENGAN CLOUD NAME-MU
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