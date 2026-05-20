import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FrapCardEdit } from '../../components/FrapCard';
import { defaultFraps } from '../../data/defaultFraps';
import { createGame, insertFraps } from '../../lib/gameService';
import type { FrapFormData } from '../../types/game';

const SetupGamePage: React.FC = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number>(10);
  const [fraps, setFraps] = useState<FrapFormData[]>(defaultFraps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFrap = (index: number, updated: FrapFormData) =>
    setFraps((prev) => prev.map((f, i) => (i === index ? updated : f)));

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    try {
      const game = await createGame(credits);
      await insertFraps(game.id, fraps);
      navigate(`/presenter/dashboard/${game.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setLoading(false);
    }
  };

  const totalPresenterCredits = fraps.reduce((sum, f) => sum + f.presenter_credits, 0);

  return (
    <Layout title="Configuration" showBack>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
          Nouvelle partie
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '14px' }}>
          Configurez les FRAP puis lancez la partie.
        </p>

        <Card style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                Budget de crédits par équipe
              </label>
              <input
                type="number" min={1} max={99} value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                style={{
                  width: '80px', background: '#0f1117', border: '1px solid #3d4166',
                  borderRadius: '8px', color: '#e2e8f0', padding: '8px 12px',
                  fontSize: '18px', fontWeight: 700, outline: 'none', textAlign: 'center',
                }}
              />
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Crédits présentateur</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: totalPresenterCredits > credits ? '#ef4444' : '#a78bfa' }}>
                {totalPresenterCredits}
                <span style={{ fontSize: '14px', color: '#64748b' }}>/{credits}</span>
              </span>
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8', margin: '0 0 12px' }}>
            FRAP ({fraps.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fraps.map((frap, index) => (
              <FrapCardEdit key={frap.code} frap={frap} onChange={(u) => updateFrap(index, u)} />
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            background: '#7f1d1d33', border: '1px solid #ef444455', borderRadius: '10px',
            padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="lg" onClick={handleLaunch} loading={loading}>
            🚀 Lancer la partie
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default SetupGamePage;
