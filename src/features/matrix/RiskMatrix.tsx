import React from 'react';
import { motion } from 'motion/react';
import type { Frap, FrapAnswers, UpdatedPosition } from '../../types/game';
import { computeUpdatedFrapPosition, getRiskColor } from '../../lib/score';

interface RiskMatrixProps {
  fraps: Frap[];
  answers?: FrapAnswers;
  /** Si true, affiche les positions initiales ET les flèches vers les positions après investissement */
  showEvolution?: boolean;
  size?: number;
  title?: string;
}

interface FrapPoint {
  frap: Frap;
  initial: UpdatedPosition;
  updated: UpdatedPosition;
  credits: number;
}

const PADDING_LEFT = 48;
const PADDING_BOTTOM = 48;
const PADDING_TOP = 24;
const PADDING_RIGHT = 20;

const RiskMatrix: React.FC<RiskMatrixProps> = ({
  fraps,
  answers = {},
  showEvolution = false,
  size = 360,
  title,
}) => {
  const gridWidth = size - PADDING_LEFT - PADDING_RIGHT;
  const gridHeight = size - PADDING_TOP - PADDING_BOTTOM;
  const cellW = gridWidth / 5;
  const cellH = gridHeight / 5;

  /** Centre SVG d'une cellule (prob, impact) */
  const toSvg = (prob: number, imp: number) => ({
    x: PADDING_LEFT + (prob - 1) * cellW + cellW / 2,
    y: PADDING_TOP + (5 - imp) * cellH + cellH / 2,
  });

  const points: FrapPoint[] = fraps.map((frap) => {
    const credits = answers[frap.id] ?? 0;
    const initial: UpdatedPosition = { probability: frap.probability, impact: frap.impact };
    const updated = computeUpdatedFrapPosition(frap, credits);
    return { frap, initial, updated, credits };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {title && (
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>{title}</span>
      )}

      <svg
        width={size}
        height={size}
        style={{ overflow: 'visible', maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Cellules colorées */}
        {Array.from({ length: 5 }, (_, impIdx) =>
          Array.from({ length: 5 }, (_, probIdx) => {
            const prob = probIdx + 1;
            const imp = 5 - impIdx;
            const color = getRiskColor(prob, imp);
            return (
              <rect
                key={`cell-${prob}-${imp}`}
                x={PADDING_LEFT + probIdx * cellW}
                y={PADDING_TOP + impIdx * cellH}
                width={cellW}
                height={cellH}
                fill={`${color}18`}
                stroke="#2d3148"
                strokeWidth={0.5}
              />
            );
          })
        )}

        {/* Étiquettes probabilité (axe X) */}
        {[1, 2, 3, 4, 5].map((p) => (
          <text
            key={`px-${p}`}
            x={PADDING_LEFT + (p - 1) * cellW + cellW / 2}
            y={PADDING_TOP + gridHeight + 20}
            textAnchor="middle"
            fill="#64748b"
            fontSize={11}
          >
            {p}
          </text>
        ))}

        {/* Étiquettes impact (axe Y) */}
        {[1, 2, 3, 4, 5].map((i) => (
          <text
            key={`iy-${i}`}
            x={PADDING_LEFT - 10}
            y={PADDING_TOP + (5 - i) * cellH + cellH / 2 + 4}
            textAnchor="end"
            fill="#64748b"
            fontSize={11}
          >
            {i}
          </text>
        ))}

        {/* Label axe X */}
        <text
          x={PADDING_LEFT + gridWidth / 2}
          y={size - 4}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={11}
          fontWeight={600}
        >
          Probabilité →
        </text>

        {/* Label axe Y */}
        <text
          x={10}
          y={PADDING_TOP + gridHeight / 2}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={11}
          fontWeight={600}
          transform={`rotate(-90, 10, ${PADDING_TOP + gridHeight / 2})`}
        >
          Impact →
        </text>

        {/* Flèches d'évolution */}
        {showEvolution &&
          points
            .filter(
              (p) =>
                p.credits > 0 &&
                (p.initial.probability !== p.updated.probability ||
                  p.initial.impact !== p.updated.impact)
            )
            .map(({ frap, initial, updated }) => {
              const from = toSvg(initial.probability, initial.impact);
              const to = toSvg(updated.probability, updated.impact);
              return (
                <line
                  key={`arrow-${frap.id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#a78bfa"
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  markerEnd="url(#arrowhead)"
                  opacity={0.7}
                />
              );
            })}

        {/* Définition de la flèche */}
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
          </marker>
        </defs>

        {/* Points position initiale */}
        {points.map(({ frap, initial, credits }) => {
          const { x, y } = toSvg(initial.probability, initial.impact);
          const color = getRiskColor(initial.probability, initial.impact);

          return (
            <motion.g
              key={`dot-initial-${frap.id}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: showEvolution && credits > 0 ? 0.35 : 1 }}
              transition={{ duration: 0.4, type: 'spring' }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={10} fill={color} opacity={0.25} />
              <circle cx={x} cy={y} r={5} fill={color} />
              <title>{frap.code} — {frap.title}</title>
            </motion.g>
          );
        })}

        {/* Points position après évolution */}
        {showEvolution &&
          points
            .filter((p) => p.credits > 0)
            .map(({ frap, updated }) => {
              const { x, y } = toSvg(updated.probability, updated.impact);
              const color = getRiskColor(updated.probability, updated.impact);

              return (
                <motion.g
                  key={`dot-updated-${frap.id}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                  style={{ transformOrigin: `${x}px ${y}px` }}
                >
                  <circle cx={x} cy={y} r={12} fill={color} opacity={0.2} />
                  <circle cx={x} cy={y} r={6} fill={color} />
                  <circle cx={x} cy={y} r={6} fill="none" stroke="#fff" strokeWidth={1.5} />
                  <title>{frap.code} (après traitement)</title>
                </motion.g>
              );
            })}

        {/* Labels des codes FRAP */}
        {points.map(({ frap, initial, credits, updated }) => {
          const pos = showEvolution && credits > 0 ? updated : initial;
          const { x, y } = toSvg(pos.probability, pos.impact);
          return (
            <text
              key={`label-${frap.id}`}
              x={x}
              y={y - 9}
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize={9}
              fontWeight={700}
              opacity={0.8}
            >
              {frap.code.replace('FRAP-', '')}
            </text>
          );
        })}
      </svg>

      {/* Légende */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { color: '#22c55e', label: 'Faible' },
          { color: '#eab308', label: 'Moyen' },
          { color: '#f97316', label: 'Élevé' },
          { color: '#ef4444', label: 'Critique' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color,
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMatrix;

