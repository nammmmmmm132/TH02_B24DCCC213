import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        🌐 Trang chủ
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          width: '80%',
          maxWidth: '900px',
        }}
      >
        <Link
          to="/countries"
          style={{
            textDecoration: 'none',
            background: '#4facfe',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s ease, background 0.3s',
          }}
        >
          🌍 Tra cứu Quốc gia
        </Link>

        <Link
          to="/currency"
          style={{
            textDecoration: 'none',
            background: '#43e97b',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          💱 Chuyển đổi tiền tệ
        </Link>

        <Link
          to="/movies"
          style={{
            textDecoration: 'none',
            background: '#fa709a',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          }}
        >
          🎬 Tìm kiếm phim
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
