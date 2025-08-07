// src/components/Footer.jsx
import React from 'react';

const footerStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  marginTop: 'auto' // Mendorong footer ke bawah
};

function Footer() {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Profil SD Negeri Karang Kemiri.</p>
    </footer>
  );
}

export default Footer;