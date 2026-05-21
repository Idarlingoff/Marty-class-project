import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import RiskMatrix from '../matrix/RiskMatrix';
import { FrapCardRead } from '../../components/FrapCard';
import { getGameById, getGameFraps, getTeamAnswers, updateGameStatus, subscribeToTeamAnswers } from '../../lib/gameService';
import type { Game, Frap, TeamAnswer, FrapAnswers } from '../../types/game';

type ViewMode = 'credits' | 'matrix';

interface BlockProps {
  title: string;
  color: string;
  fraps: Frap[];
  answers: FrapAnswers;
  hasAnswered: boolean;
  gameCredits: number;
}

const Block: React.FC<BlockProps> = ({ title, color, fraps, answers, hasAnswered, gameCredits }) => {
  const [view, setView] = useState<ViewMode>('credits');
  const creditsUsed = Object.values(answers).reduce((s, c) => s + c, 0);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* En-tête bloc */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '15px' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px', padding: '3px 8px', borderRadius: '20px', fontWeight: 600,
            background: hasAnswered ? '#16532233' : '#44444433',
            color: hasAnswered ? '#4ade80' : '#94a3b8',
            border: `1px solid ${hasAnswered ? '#4ade8055' : '#44444455'}`,
          }}>
            {hasAnswered ? '✓ Répondu' : '⏳ En attente'}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {creditsUsed}/{gameCredits} crédits
          </span>
        </div>
      </div>

      {/* Toggle vue */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {(['credits', 'matrix'] as ViewMode[]).map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: view === v ? '#7c3aed' : '#1f2235',
            color: view === v ? '#fff' : '#94a3b8',
            border: view === v ? 'none' : '1px solid #3d4166',
          }}>
            {v === 'credits' ? '💰 Crédits' : '📊 Matrice'}
          </button>
        ))}
      </div>

      {/* Contenu */}
      {view === 'credits' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
          {fraps.map((frap) => (
            <FrapCardRead key={frap.id} frap={frap} credits={answers[frap.id] ?? 0} showCredits />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RiskMatrix fraps={fraps} answers={answers} showEvolution size={280} />
        </div>
      )}
    </Card>
  );
};

const BLOCK_COLORS = ['#a78bfa', '#34d399', '#60a5fa', '#f472b6'];

const PresenterDashboardPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [fraps, setFraps] = useState<Frap[]>([]);
  const [teamAnswers, setTeamAnswers] = useState<TeamAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  const load = useCallback(async () => {
    if (!gameId) return;
    try {
      const [g, f, ta] = await Promise.all([
        getGameById(gameId),
        getGameFraps(gameId),
        getTeamAnswers(gameId),
      ]);
      setGame(g);
      setFraps(f);
      setTeamAnswers(ta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    if (!gameId) return;
    // Abonnement temps réel
    const unsub = subscribeToTeamAnswers(gameId, (fresh) => setTeamAnswers(fresh));
    return unsub;
  }, [gameId, load]);

  const handleFinish = async () => {
    if (!gameId) return;
    setFinishing(true);
    try {
      await updateGameStatus(gameId, 'finished');
      navigate(`/presenter/results/${gameId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setFinishing(false);
    }
  };

  if (loading) return <Layout title="Dashboard"><p style={{ color: '#64748b', textAlign: 'center', marginTop: '60px' }}>Chargement…</p></Layout>;
  if (error) return <Layout title="Dashboard"><p style={{ color: '#ef4444', textAlign: 'center', marginTop: '60px' }}>{error}</p></Layout>;
  if (!game) return <Layout title="Dashboard"><p style={{ color: '#64748b', textAlign: 'center', marginTop: '60px' }}>Partie introuvable.</p></Layout>;

  // Réponses présentateur : utilise presenter_credits de chaque FRAP
  const presenterAnswers: FrapAnswers = {};
  fraps.forEach((f) => { presenterAnswers[f.id] = f.presenter_credits; });

  const blocks = [
    { title: 'Présentateur', answers: presenterAnswers, hasAnswered: true },
    ...([1, 2, 3] as const).map((n) => {
      const ta = teamAnswers.find((t) => t.team_number === n);
      return { title: `Équipe ${n}`, answers: ta?.answers ?? {}, hasAnswered: !!ta };
    }),
  ];

  const allAnswered = teamAnswers.length >= 3;

  return (
    <Layout title="Dashboard présentateur" showBack>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px' }}>
              Dashboard en cours
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              Budget : {game.credits} crédits · {teamAnswers.length}/3 équipes ont répondu
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" size="sm" onClick={load}>↻ Actualiser</Button>
            {allAnswered && (
              <Button size="sm" onClick={handleFinish} loading={finishing}>
                🏁 Voir les résultats
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: '#7f1d1d33', border: '1px solid #ef444455', borderRadius: '10px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {blocks.map((b, i) => (
            <Block
              key={b.title}
              title={b.title}
              color={BLOCK_COLORS[i]}
              fraps={fraps}
              answers={b.answers}
              hasAnswered={b.hasAnswered}
              gameCredits={game.credits}
            />
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default PresenterDashboardPage;
