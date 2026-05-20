import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import { getActiveGame } from '../../lib/gameService';
import type { Game } from '../../types/game';

const TEAMS = [
  { number: 1, emoji: '🔵', color: '#60a5fa' },
  { number: 2, emoji: '🟢', color: '#34d399' },
  { number: 3, emoji: '🟣', color: '#f472b6' },
];

const TeamSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActiveGame()
      .then(setGame)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Choix de l'équipe"><p style={{ color: '#64748b', textAlign: 'center', marginTop: '60px' }}>Recherche d'une partie active…</p></Layout>;

  return (
    <Layout title="Rejoindre la partie" showBack>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px', textAlign: 'center' }}>
          Choisissez votre équipe
        </h1>

        {error && (
          <div style={{ background: '#7f1d1d33', border: '1px solid #ef444455', borderRadius: '10px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {!game ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Aucune partie active pour le moment.</p>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Demandez au présentateur de lancer une partie.</p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '14px', textAlign: 'center' }}>
              Partie active — Budget : {game.credits} crédits
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {TEAMS.map((team, i) => (
                <motion.div
                  key={team.number}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    onClick={() => navigate(`/team/${team.number}`)}
                    style={{
                      cursor: 'pointer', width: '160px', textAlign: 'center', padding: '32px 20px',
                      borderColor: team.color, transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>{team.emoji}</div>
                    <div style={{ fontWeight: 700, color: team.color, fontSize: '18px' }}>
                      Équipe {team.number}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default TeamSelectPage;
