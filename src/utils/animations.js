// src/utils/animations.js

// Varian untuk container yang akan membuat anak-anaknya muncul satu per satu
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Jeda antar setiap anak
      delayChildren: 0.1,   // Jeda sebelum anak pertama muncul
    },
  },
};

// Varian untuk item yang akan muncul dari bawah sambil fade in
export const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

// Varian untuk fade in sederhana
export const fadeIn = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };