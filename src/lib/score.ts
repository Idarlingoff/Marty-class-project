import type { Frap, FrapAnswers, UpdatedPosition } from '../types/game';

/**
 * Calcule la nouvelle position d'une FRAP après investissement de crédits.
 * - 0 crédit : aucun changement
 * - 1 crédit : impact -1
 * - 2 crédits : probabilité -1, impact -1
 * - 3 crédits : probabilité -2, impact -2
 * Les valeurs restent toujours entre 1 et 5.
 */
export function computeUpdatedFrapPosition(
  frap: Pick<Frap, 'probability' | 'impact'>,
  credits: number
): UpdatedPosition {
  const clamp = (val: number) => Math.max(1, Math.min(5, val));

  switch (credits) {
    case 1:
      return { probability: frap.probability, impact: clamp(frap.impact - 1) };
    case 2:
      return {
        probability: clamp(frap.probability - 1),
        impact: clamp(frap.impact - 1),
      };
    case 3:
      return {
        probability: clamp(frap.probability - 2),
        impact: clamp(frap.impact - 2),
      };
    default:
      return { probability: frap.probability, impact: frap.impact };
  }
}

/**
 * Calcule la réduction de risque entre la position initiale et la position après traitement.
 * Risque = probabilité × impact
 */
export function computeRiskReduction(
  initial: UpdatedPosition,
  updated: UpdatedPosition
): number {
  const initialRisk = initial.probability * initial.impact;
  const updatedRisk = updated.probability * updated.impact;
  return Math.max(0, initialRisk - updatedRisk);
}

/**
 * Calcule le score d'efficience d'une équipe.
 * Score = somme des réductions de risque / crédits utilisés
 * Retourne 0 si aucun crédit n'est utilisé.
 */
export function computeTeamScore(fraps: Frap[], answers: FrapAnswers): number {
  const totalCreditsUsed = Object.values(answers).reduce((sum, c) => sum + c, 0);
  if (totalCreditsUsed === 0) return 0;

  const totalReduction = fraps.reduce((sum, frap) => {
    const credits = answers[frap.id] ?? 0;
    const initial: UpdatedPosition = { probability: frap.probability, impact: frap.impact };
    const updated = computeUpdatedFrapPosition(frap, credits);
    return sum + computeRiskReduction(initial, updated);
  }, 0);

  return parseFloat((totalReduction / totalCreditsUsed).toFixed(2));
}

/** Retourne la couleur associée à un niveau de risque (probabilité × impact) */
export function getRiskColor(probability: number, impact: number): string {
  const score = probability * impact;
  if (score >= 15) return '#ef4444'; // rouge — critique
  if (score >= 10) return '#f97316'; // orange — élevé
  if (score >= 5) return '#eab308';  // jaune — moyen
  return '#22c55e';                  // vert — faible
}

/** Retourne le libellé du niveau de risque */
export function getRiskLabel(probability: number, impact: number): string {
  const score = probability * impact;
  if (score >= 15) return 'Critique';
  if (score >= 10) return 'Élevé';
  if (score >= 5) return 'Moyen';
  return 'Faible';
}

