import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f1117',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #2d3148',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: '#12141f',
          flexShrink: 0,
        }}
      >
        {showBack && !isHome && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px 8px',
              borderRadius: '6px',
              lineHeight: 1,
            }}
            title="Retour"
          >
            ←
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {/* Logo / titre app */}
          <span
            style={{
              fontWeight: 800,
              fontSize: '16px',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FRAP
          </span>
          <span style={{ color: '#2d3148' }}>|</span>
          {title && (
            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
              {title}
            </span>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

