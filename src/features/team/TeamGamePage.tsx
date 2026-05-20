import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FrapCardRead } from '../../components/FrapCard';
import RiskMatrix from '../matrix/RiskMatrix';
import { getActiveGame, getGameFraps, getTeamAnswer, submitTeamAnswers } from '../../lib/gameService';
import type { Game, Frap, FrapAnswers } from '../../types/game';

const TeamGamePage: React.FC = () => {
  const { teamNumber } = useParams<{ teamNumber: string }>();
  const navigate = useNavigate();
  const teamNum = Number(teamNumber);

  const [game, setGame] = useState<Game | null>(null);
  const [fraps, setFraps] = useState<Frap[]>([]);
  const [answers, setAnswers] = useState<FrapAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const g = await getActiveGame();
        if (!g) { setError("Aucune partie active. Demandez au présentateur de lancer une partie."); return; }

        const [f, existing] = await Promise.all([getGameFraps(g.id), getTeamAnswer(g.id, teamNum)]);
        setGame(g);
        setFraps(f);

        if (existing) {
          setAnswers(existing.answers);
          setSubmitted(true);
        } else {
          const init: FrapAnswers = {};
          f.forEach((frap) => { init[frap.id] = 0; });
          setAnswers(init);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur chargement');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [teamNum]);

  const totalUsed = Object.values(answers).reduce((s, c) => s + c, 0);
  const remaining = (game?.credits ?? 0) - totalUsed;

  const setCredit = (frapId: string, credit: number) => {
    if (submitted) return;
    const current = answers[frapId] ?? 0;
    const delta = credit - current;
    if (delta > remaining && delta > 0) return; // dépassement budget
    setAnswers((prev) => ({ ...prev, [frapId]: credit }));
  };

  const handleSubmit = async () => {
    if (!game) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitTeamAnswers(game.id, teamNum, answers, remaining);
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const TEAM_COLORS = ['', '#60a5fa', '#34d399', '#f472b6'];
  const teamColor = TEAM_COLORS[teamNum] ?? '#a78bfa';

  if (loading) return <Layout title={`Équipe ${teamNum}`}><p style={{ color: '#64748b', textAlign: 'center', marginTop: '60px' }}>Chargement…</p></Layout>;

  if (error) return (
    <Layout title={`Équipe ${teamNum}`} showBack>
      <Card style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center', borderColor: '#ef444455' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
        <p style={{ color: '#fca5a5' }}>{error}</p>
        <Button variant="ghost" onClick={() => navigate('/team')} style={{ marginTop: '16px' }}>← Retour</Button>
      </Card>
    </Layout>
  );

  return (
    <Layout title={`Équipe ${teamNum}`} showBack>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: teamColor, margin: '0 0 4px' }}>
              Équipe {teamNum}
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Attribuez vos crédits sur les FRAP.
            </p>
          </div>

          {/* Budget */}
          <Card style={{ textAlign: 'center', padding: '12px 20px', minWidth: '140px', borderColor: remaining < 0 ? '#ef4444' : teamColor }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Budget restant</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: remaining < 0 ? '#ef4444' : '#e2e8f0' }}>
              {remaining}
              <span style={{ fontSize: '14px', color: '#64748b' }}>/{game?.credits}</span>
            </div>
          </Card>
        </div>

        {/* Soumis */}
        {submitted && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card style={{ marginBottom: '24px', textAlign: 'center', borderColor: '#4ade8055', background: '#16532211' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <div style={{ fontWeight: 700, color: '#4ade80', fontSize: '18px' }}>Réponses soumises !</div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                En attente des résultats du présentateur.
              </div>
            </Card>
          </motion.div>
        )}

        {/* Toggle matrice */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setShowMatrix(false)} style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: !showMatrix ? teamColor : '#1f2235',
            color: !showMatrix ? '#fff' : '#94a3b8',
            border: !showMatrix ? 'none' : '1px solid #3d4166',
          }}>📋 FRAP</button>
          <button onClick={() => setShowMatrix(true)} style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            background: showMatrix ? teamColor : '#1f2235',
            color: showMatrix ? '#fff' : '#94a3b8',
            border: showMatrix ? 'none' : '1px solid #3d4166',
          }}>📊 Matrice</button>
        </div>

        {showMatrix ? (
          <Card>
            <RiskMatrix fraps={fraps} answers={answers} showEvolution size={400} title="Votre matrice après investissement" />
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {fraps.map((frap) => (
              <FrapCardRead
                key={frap.id}
                frap={frap}
                credits={answers[frap.id] ?? 0}
                onCreditsChange={(c) => setCredit(frap.id, c)}
                creditsDisabled={submitted}
                showCredits
              />
            ))}
          </div>
        )}

        {!submitted && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            {error && <p style={{ color: '#fca5a5', fontSize: '14px', alignSelf: 'center' }}>{error}</p>}
            <Button
              size="lg"
              onClick={handleSubmit}
              loading={submitting}
              disabled={remaining < 0}
            >
              ✅ Valider mes choix
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default TeamGamePage;
