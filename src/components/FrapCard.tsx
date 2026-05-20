import React from 'react';
import { motion } from 'motion/react';
import type { Frap, FrapFormData, Criticality } from '../types/game';
import { getRiskColor } from '../lib/score';
import CreditSelector from './CreditSelector';
import Card from './Card';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '14px 18px',
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
          }}
        >
          {frap.code}
        </span>

        {/* Nom */}
        <span style={{ flex: 1, color: '#e2e8f0', fontSize: '14px', textAlign: 'left' }}>
          {frap.name}
        </span>

        {/* Indicateurs */}
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
            }}
          />
        </div>

        {/* Sélecteur de crédits */}
        {showCredits && onCreditsChange && (
          <CreditSelector
            value={credits}
            onChange={onCreditsChange}
            disabled={creditsDisabled}
          />
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

  const update = (patch: Partial<FrapFormData>) => onChange({ ...frap, ...patch });

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
      <Card style={{ padding: '16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto auto auto auto',
            gap: '12px',
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

          {/* Nom */}
          <input
            value={frap.name}
            onChange={(e) => update({ name: e.target.value })}
            style={{ ...inputStyle, width: '100%' }}
            placeholder="Nom du risque"
          />

          {/* Criticité */}
          <select
            value={frap.criticality}
            onChange={(e) => update({ criticality: e.target.value as Criticality })}
            style={{ ...inputStyle }}
          >
            {CRITICALITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
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
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
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
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
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
      </Card>
    </motion.div>
  );
};

export default FrapCardRead;

