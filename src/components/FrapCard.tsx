import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Frap, FrapFormData, Criticality, CreditActions } from '../types/game';
import { getRiskColor } from '../lib/score';
import CreditSelector from './CreditSelector';
import Card from './Card';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CREDIT_LEVEL: Record<1 | 2 | 3, { label: string; color: string; bg: string; icon: string }> = {
  1: { label: 'Faible amélioration', color: '#eab308', bg: '#eab30818', icon: '⬆' },
  2: { label: 'Amélioration moyenne', color: '#f97316', bg: '#f9731618', icon: '⬆⬆' },
  3: { label: 'Amélioration forte', color: '#22c55e', bg: '#22c55e18', icon: '⬆⬆⬆' },
};

const CreditActionBadge: React.FC<{ level: 1 | 2 | 3; text: string; active?: boolean }> = ({
  level,
  text,
  active = false,
}) => {
  const { label, color, bg, icon } = CREDIT_LEVEL[level];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: (level - 1) * 0.07 }}
      style={{
        display: 'flex',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '8px',
        background: active ? bg : '#0f111722',
        border: `1px solid ${active ? color + '55' : '#2d314833'}`,
        alignItems: 'flex-start',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      {/* Level badge */}
      <div style={{ flexShrink: 0 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: `${color}22`,
            border: `1px solid ${color}55`,
            borderRadius: '20px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 700,
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {icon} {level} crédit{level > 1 ? 's' : ''}
        </span>
        <div style={{ fontSize: '10px', color: color + 'cc', marginTop: '2px', textAlign: 'center' }}>
          {label}
        </div>
      </div>
      {/* Description */}
      <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{text}</p>
    </motion.div>
  );
};

// ─── Mode lecture (équipes, dashboard) ──────────────────────────────────────

interface FrapReadProps {
  frap: Frap;
  credits?: number;
  onCreditsChange?: (credits: number) => void;
  creditsDisabled?: boolean;
  showCredits?: boolean;
}

export const FrapCardRead: React.FC<FrapReadProps> = ({
  frap,
  credits = 0,
  onCreditsChange,
  creditsDisabled = false,
  showCredits = true,
}) => {
  const color = getRiskColor(frap.probability, frap.impact);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card style={{ padding: '0' }}>
        {/* ── En-tête cliquable ── */}
        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {/* Badge code */}
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 700,
              color,
              background: `${color}22`,
              border: `1px solid ${color}55`,
              borderRadius: '6px',
              padding: '3px 8px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {frap.code}
          </span>

          {/* Cycle badge */}
          <span
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              background: '#1f2235',
              border: '1px solid #3d4166',
              borderRadius: '6px',
              padding: '2px 6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {frap.cycle}
          </span>

          {/* Titre */}
          <span style={{ flex: 1, color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>
            {frap.title}
          </span>

          {/* Indicateurs P/I */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              P:{frap.probability} / I:{frap.impact}
            </span>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
          </div>

          {/* Sélecteur / affichage crédits */}
          {showCredits && onCreditsChange && (
            <span onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0 }}>
              <CreditSelector value={credits} onChange={onCreditsChange} disabled={creditsDisabled} />
            </span>
          )}
          {showCredits && !onCreditsChange && (
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: credits > 0 ? '#a78bfa' : '#64748b',
                minWidth: '60px',
                textAlign: 'right',
              }}
            >
              {credits} crédit{credits > 1 ? 's' : ''}
            </span>
          )}

          {/* Expand chevron */}
          <span
            style={{
              fontSize: '14px',
              color: '#64748b',
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'none',
              flexShrink: 0,
            }}
          >
            ▾
          </span>
        </button>

        {/* ── Détails expandables ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '0 18px 16px',
                  borderTop: '1px solid #2d3148',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginTop: '0',
                  paddingTop: '14px',
                }}
              >
                {/* Problématique */}
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '6px',
                    }}
                  >
                    🔍 Problématique
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#cbd5e1',
                      lineHeight: '1.6',
                      background: '#0f111733',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    {frap.description}
                  </p>
                </div>

                {/* Impact des investissements */}
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '8px',
                    }}
                  >
                    💡 Impact des investissements
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {([1, 2, 3] as const).map((lvl) => (
                      <CreditActionBadge
                        key={lvl}
                        level={lvl}
                        text={frap.creditActions[lvl]}
                        active={credits >= lvl}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// ─── Mode édition (setup présentateur) ──────────────────────────────────────

interface FrapEditProps {
  frap: FrapFormData;
  onChange: (updated: FrapFormData) => void;
}

const CRITICALITIES: Criticality[] = ['faible', 'moyen', 'élevé', 'critique'];

export const FrapCardEdit: React.FC<FrapEditProps> = ({ frap, onChange }) => {
  const color = getRiskColor(frap.probability, frap.impact);
  const [expanded, setExpanded] = useState(false);

  const update = (patch: Partial<FrapFormData>) => onChange({ ...frap, ...patch });
  const updateCreditAction = (level: keyof CreditActions, value: string) =>
    onChange({ ...frap, creditActions: { ...frap.creditActions, [level]: value } });

  const inputStyle: React.CSSProperties = {
    background: '#0f1117',
    border: '1px solid #3d4166',
    borderRadius: '6px',
    color: '#e2e8f0',
    padding: '4px 8px',
    fontSize: '13px',
    outline: 'none',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card style={{ padding: '0' }}>
        {/* ── Ligne principale ── */}
        <div style={{ padding: '14px 16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto auto auto',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {/* Code */}
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 700,
                color,
                background: `${color}22`,
                border: `1px solid ${color}55`,
                borderRadius: '6px',
                padding: '3px 8px',
                whiteSpace: 'nowrap',
              }}
            >
              {frap.code}
            </span>

            {/* Titre */}
            <input
              value={frap.title}
              onChange={(e) => update({ title: e.target.value })}
              style={{ ...inputStyle, width: '100%' }}
              placeholder="Titre du risque"
            />

            {/* Criticité */}
            <select
              value={frap.criticality}
              onChange={(e) => update({ criticality: e.target.value as Criticality })}
              style={inputStyle}
            >
              {CRITICALITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Probabilité */}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Prob.</span>
              <select
                value={frap.probability}
                onChange={(e) => update({ probability: Number(e.target.value) })}
                style={{ ...inputStyle, width: '52px' }}
              >
                {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>

            {/* Impact */}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Impact</span>
              <select
                value={frap.impact}
                onChange={(e) => update({ impact: Number(e.target.value) })}
                style={{ ...inputStyle, width: '52px' }}
              >
                {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>

            {/* Crédits présentateur */}
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Crédits</span>
              <CreditSelector
                value={frap.presenter_credits}
                onChange={(c) => update({ presenter_credits: c })}
              />
            </label>
          </div>

          {/* Cycle + expand toggle */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Cycle :</span>
            <input
              value={frap.cycle}
              onChange={(e) => update({ cycle: e.target.value })}
              style={{ ...inputStyle, fontSize: '12px', padding: '3px 8px', flex: 1 }}
              placeholder="Cycle (ex : Trésorerie)"
            />
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                background: 'none',
                border: '1px solid #3d4166',
                borderRadius: '6px',
                color: '#94a3b8',
                fontSize: '12px',
                padding: '3px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ✏️ Détails
              <span style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none' }}>
                ▾
              </span>
            </button>
          </div>
        </div>

        {/* ── Détails éditables ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '0 16px 16px',
                  borderTop: '1px solid #2d3148',
                  paddingTop: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {/* Description */}
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                    🔍 Problématique
                  </div>
                  <textarea
                    value={frap.description}
                    onChange={(e) => update({ description: e.target.value })}
                    rows={3}
                    style={{
                      ...inputStyle,
                      width: '100%',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      lineHeight: '1.5',
                    }}
                    placeholder="Description du problème identifié..."
                  />
                </div>

                {/* Credit actions */}
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    💡 Impact des investissements
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {([1, 2, 3] as const).map((lvl) => {
                      const { label, color: lvlColor, icon } = CREDIT_LEVEL[lvl];
                      return (
                        <div key={lvl} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span
                            style={{
                              flexShrink: 0,
                              marginTop: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: `${lvlColor}22`,
                              border: `1px solid ${lvlColor}55`,
                              borderRadius: '20px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: lvlColor,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {icon} {lvl} cr. — {label}
                          </span>
                          <textarea
                            value={frap.creditActions[lvl]}
                            onChange={(e) => updateCreditAction(lvl, e.target.value)}
                            rows={2}
                            style={{
                              ...inputStyle,
                              flex: 1,
                              resize: 'vertical',
                              lineHeight: '1.5',
                              fontSize: '12px',
                            }}
                            placeholder={`Action à ${lvl} crédit${lvl > 1 ? 's' : ''}...`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FrapCardRead;

