// Types centraux pour l'application FRAP

export type GameStatus = 'setup' | 'active' | 'finished';
export type Criticality = 'faible' | 'moyen' | 'élevé' | 'critique';

export interface CreditActions {
  1: string;
  2: string;
  3: string;
}

export interface Game {
  id: string;
  status: GameStatus;
  credits: number;
  created_at: string;
}

export interface Frap {
  id: string;
  game_id: string;
  code: string;
  cycle: string;
  title: string;
  criticality: Criticality;
  probability: number; // 1 à 5
  impact: number;      // 1 à 5
  presenter_credits: number; // 0 à 3
  description: string;
  creditActions: CreditActions;
  created_at: string;
}

/** Données d'une FRAP avant insertion en base (sans champs générés) */
export interface FrapFormData {
  code: string;
  cycle: string;
  title: string;
  criticality: Criticality;
  probability: number;
  impact: number;
  presenter_credits: number;
  description: string;
  creditActions: CreditActions;
}


/** Réponses d'une équipe : frap_id → crédits investis */
export type FrapAnswers = Record<string, number>;

export interface TeamAnswer {
  id: string;
  game_id: string;
  team_number: number;
  answers: FrapAnswers;
  remaining_credits: number;
  created_at: string;
}

export interface UpdatedPosition {
  probability: number;
  impact: number;
}

