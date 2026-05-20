import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import RiskMatrix from '../matrix/RiskMatrix';
import { getGameById, getGameFraps, getTeamAnswers } from '../../lib/gameService';
import { computeTeamScore, computeUpdatedFrapPosition, computeRiskReduction, getRiskColor } from '../../lib/score';
import type { Game, Frap, TeamAnswer, FrapAnswers, UpdatedPosition } from '../../types/game';

interface ScoreBlock {
  title: string;
  color: string;
  answers: FrapAnswers;
  score: number;
  creditsUsed: number;
  hasAnswered: boolean;
}

const COLORS = ['#a78bfa', '#34d399', '#60a5fa', '#f472b6'];

// ── Accordéon FRAP par bloc ──────────────────────────────────────────────────
const FrapAccordion: React.FC<{ fraps: Frap[]; answers: FrapAnswers; color: string }> = ({
  fraps,
  answers,
  color,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderTop: '1px solid #2d3148', marginTop: '12px', paddingTop: '8px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
          color: '#94a3b8', fontSize: '13px', fontWeight: 600,
        }}
      >
        <span>📋 Détail des FRAP</span>
        <span style={{ fontSize: '16px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {fraps.map((frap) => {
                const credits = answers[frap.id] ?? 0;
                const initial: UpdatedPosition = { probability: frap.probability, impact: frap.impact };
                const updated = computeUpdatedFrapPosition(frap, credits);
                const reduction = computeRiskReduction(initial, updated);
                const dotColor = getRiskColor(frap.probability, frap.impact);

                return (
                  <div
                    key={frap.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 10px', borderRadius: '8px',
                      background: credits > 0 ? `${color}0d` : 'transparent',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: dotColor, minWidth: '56px' }}>{frap.code}</span>
                    <span style={{ flex: 1, fontSize: '13px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {frap.name}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: credits > 0 ? color : '#475569', minWidth: '48px', textAlign: 'right' }}>
                      {credits} cr.
                    </span>
                    {reduction > 0 && (
                      <span style={{ fontSize: '11px', color: '#4ade80', minWidth: '52px', textAlign: 'right' }}>
                        −{reduction} risque
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Bloc individuel (1 des 4 participants) ───────────────────────────────────
const ResultBlock: React.FC<{
  block: ScoreBlock;
  fraps: Frap[];
  isBest: boolean;
  delay: number;
  getTotalReduction: (a: FrapAnswers) => number;
}> = ({ block, fraps, isBest, delay, getTotalReduction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card
      style={{
        borderColor: isBest ? block.color : '#2d3148',
        background: isBest ? `${block.color}0a` : '#1a1d27',
        display: 'flex', flexDirection: 'column', gap: '0',
      }}
    >
      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: block.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 800, color: block.color, fontSize: '17px' }}>
            {block.title} {isBest && '🏆'}
          </span>
        </div>
        {!block.hasAnswered && (
          <span style={{ fontSize: '11px', color: '#64748b', background: '#1f2235', padding: '3px 8px', borderRadius: '20px', border: '1px solid #3d4166' }}>
            Pas de réponse
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Crédits utilisés', value: block.hasAnswered ? String(block.creditsUsed) : '—' },
          { label: 'Réduction totale', value: block.hasAnswered ? String(getTotalReduction(block.answers)) : '—' },
          { label: 'Score efficience', value: block.hasAnswered ? String(block.score) : '—', highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} style={{
            flex: 1, minWidth: '80px', background: '#0f1117', borderRadius: '10px',
            padding: '10px 12px', textAlign: 'center', border: '1px solid #2d3148',
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: highlight && block.hasAnswered ? '#4ade80' : '#e2e8f0' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Matrice grande */}
      {block.hasAnswered ? (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <RiskMatrix fraps={fraps} answers={{}} title="Avant" size={260} />
          <RiskMatrix fraps={fraps} answers={block.answers} showEvolution title="Après" size={260} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: '14px' }}>
          Aucune réponse soumise
        </div>
      )}

      {/* Accordéon FRAP */}
      {block.hasAnswered && (
        <FrapAccordion fraps={fraps} answers={block.answers} color={block.color} />
      )}
    </Card>
  </motion.div>
);

// ── Page principale ──────────────────────────────────────────────────────────
const ResultsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [fraps, setFraps] = useState<Frap[]>([]);
  const [teamAnswers, setTeamAnswers] = useState<TeamAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;
    Promise.all([getGameById(gameId), getGameFraps(gameId), getTeamAnswers(gameId)])
      .then(([g, f, ta]) => { setGame(g); setFraps(f); setTeamAnswers(ta); })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) return <Layout title="Résultats"><p style={{ color: '#64748b', textAlign: 'center', marginTop: '60px' }}>Chargement…</p></Layout>;
  if (error || !game) return <Layout title="Résultats"><p style={{ color: '#ef4444', textAlign: 'center', marginTop: '60px' }}>{error ?? 'Partie introuvable'}</p></Layout>;

  const presenterAnswers: FrapAnswers = {};
  fraps.forEach((f) => { presenterAnswers[f.id] = f.presenter_credits; });

  const blocks: ScoreBlock[] = [
    {
      title: 'Présentateur', color: COLORS[0], answers: presenterAnswers,
      score: computeTeamScore(fraps, presenterAnswers),
      creditsUsed: Object.values(presenterAnswers).reduce((s, c) => s + c, 0),
      hasAnswered: true,
    },
    ...([1, 2, 3] as const).map((n, i) => {
      const ta = teamAnswers.find((t) => t.team_number === n);
      const answers = ta?.answers ?? {};
      return {
        title: `Équipe ${n}`, color: COLORS[i + 1], answers,
        score: ta ? computeTeamScore(fraps, answers) : 0,
        creditsUsed: Object.values(answers).reduce((s, c) => s + c, 0),
        hasAnswered: !!ta,
      };
    }),
  ];

  const teamBlocks = blocks.slice(1).filter((b) => b.hasAnswered);
  const bestTeam = teamBlocks.length > 0 ? teamBlocks.reduce((a, b) => (b.score > a.score ? b : a)) : null;

  const getTotalReduction = (answers: FrapAnswers) =>
    fraps.reduce((sum, frap) => {
      const credits = answers[frap.id] ?? 0;
      const initial: UpdatedPosition = { probability: frap.probability, impact: frap.impact };
      const updated = computeUpdatedFrapPosition(frap, credits);
      return sum + computeRiskReduction(initial, updated);
    }, 0);

  return (
    <Layout title="Résultats" showBack>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px' }}>
              Résultats de la partie
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Budget : {game.credits} crédits · {teamAnswers.length}/3 équipe(s) ont répondu
            </p>
          </div>
          {bestTeam && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: `${bestTeam.color}18`, border: `1px solid ${bestTeam.color}55`,
                borderRadius: '12px', padding: '10px 18px',
              }}>
                <span style={{ fontSize: '24px' }}>🏆</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Meilleure efficience</div>
                  <div style={{ fontWeight: 800, color: bestTeam.color, fontSize: '16px' }}>{bestTeam.title}</div>
                </div>
                <div style={{ marginLeft: '8px', textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Score</div>
                  <div style={{ fontWeight: 800, color: '#4ade80', fontSize: '18px' }}>{bestTeam.score}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Grille 2×2 des 4 blocs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}>
          {blocks.map((block, i) => (
            <ResultBlock
              key={block.title}
              block={block}
              fraps={fraps}
              isBest={bestTeam?.title === block.title}
              delay={i * 0.08}
              getTotalReduction={getTotalReduction}
            />
          ))}
        </div>

      </motion.div>
    </Layout>
  );
};

export default ResultsPage;
