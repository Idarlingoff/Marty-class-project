import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      label: 'Présentateur',
      description: 'Créer et piloter une partie',
      emoji: '🎯',
      path: '/presenter',
      color: '#7c3aed',
    },
    {
      label: 'Participant',
      description: 'Rejoindre une partie active',
      emoji: '👥',
      path: '/team',
      color: '#0ea5e9',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <h1 style={{
          fontSize: '56px', fontWeight: 900, margin: '0 0 12px',
          background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px',
        }}>
          FRAP
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '360px' }}>
          Jeu d'étude de cas autour de l'analyse et du traitement des risques
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {options.map((opt, i) => (
          <motion.div
            key={opt.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
          >
            <Card
              onClick={() => navigate(opt.path)}
              style={{
                width: '220px', textAlign: 'center', padding: '40px 24px',
                cursor: 'pointer', borderColor: `${opt.color}44`,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '52px', marginBottom: '16px' }}>{opt.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: opt.color, marginBottom: '8px' }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{opt.description}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
