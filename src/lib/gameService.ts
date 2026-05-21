import { supabase } from './supabase';
import type { Game, GameStatus, Frap, FrapFormData, TeamAnswer, FrapAnswers } from '../types/game';

// ─── Parties ────────────────────────────────────────────────────────────────

/** Crée une nouvelle partie et la passe directement en statut "active" */
export async function createGame(credits: number): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .insert({ status: 'active' as GameStatus, credits })
    .select()
    .single();

  if (error) throw new Error(`Erreur création partie : ${error.message}`);
  return data as Game;
}

/** Récupère la première partie active trouvée */
export async function getActiveGame(): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select()
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Erreur récupération partie : ${error.message}`);
  return data as Game | null;
}

/** Récupère une partie par son ID */
export async function getGameById(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Erreur récupération partie : ${error.message}`);
  return data as Game | null;
}

/** Met à jour le statut d'une partie */
export async function updateGameStatus(id: string, status: GameStatus): Promise<void> {
  const { error } = await supabase.from('games').update({ status }).eq('id', id);
  if (error) throw new Error(`Erreur mise à jour statut : ${error.message}`);
}

// ─── FRAP ────────────────────────────────────────────────────────────────────

/** Convertit un FrapFormData (camelCase) en ligne DB (snake_case) */
function toDbRow(f: FrapFormData, gameId: string) {
  const { creditActions, ...rest } = f;
  return { ...rest, game_id: gameId, credit_actions: creditActions };
}

/** Reconvertit une ligne DB en Frap TypeScript (snake_case → camelCase) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDbRow(row: any): Frap {
  const { credit_actions, ...rest } = row;
  return { ...rest, creditActions: credit_actions ?? { 1: '', 2: '', 3: '' } } as Frap;
}

/** Insère les FRAP d'une partie */
export async function insertFraps(gameId: string, fraps: FrapFormData[]): Promise<Frap[]> {
  const rows = fraps.map((f) => toDbRow(f, gameId));
  const { data, error } = await supabase.from('fraps').insert(rows).select();

  if (error) throw new Error(`Erreur insertion FRAP : ${error.message}`);
  return (data ?? []).map(fromDbRow);
}

/** Récupère les FRAP d'une partie */
export async function getGameFraps(gameId: string): Promise<Frap[]> {
  const { data, error } = await supabase
    .from('fraps')
    .select()
    .eq('game_id', gameId)
    .order('code', { ascending: true });

  if (error) throw new Error(`Erreur récupération FRAP : ${error.message}`);
  return (data ?? []).map(fromDbRow);
}

// ─── Réponses équipes ────────────────────────────────────────────────────────

/** Soumet les réponses d'une équipe */
export async function submitTeamAnswers(
  gameId: string,
  teamNumber: number,
  answers: FrapAnswers,
  remainingCredits: number
): Promise<void> {
  const { error } = await supabase.from('team_answers').insert({
    game_id: gameId,
    team_number: teamNumber,
    answers,
    remaining_credits: remainingCredits,
  });

  if (error) throw new Error(`Erreur soumission réponses : ${error.message}`);
}

/** Récupère toutes les réponses d'une partie */
export async function getTeamAnswers(gameId: string): Promise<TeamAnswer[]> {
  const { data, error } = await supabase
    .from('team_answers')
    .select()
    .eq('game_id', gameId)
    .order('team_number', { ascending: true });

  if (error) throw new Error(`Erreur récupération réponses : ${error.message}`);
  return data as TeamAnswer[];
}

/** Vérifie si une équipe a déjà soumis ses réponses */
export async function getTeamAnswer(
  gameId: string,
  teamNumber: number
): Promise<TeamAnswer | null> {
  const { data, error } = await supabase
    .from('team_answers')
    .select()
    .eq('game_id', gameId)
    .eq('team_number', teamNumber)
    .maybeSingle();

  if (error) throw new Error(`Erreur vérification réponse équipe : ${error.message}`);
  return data as TeamAnswer | null;
}

/** Abonnement temps réel aux réponses des équipes */
export function subscribeToTeamAnswers(
  gameId: string,
  callback: (answers: TeamAnswer[]) => void
): () => void {
  const channel = supabase
    .channel(`team_answers_${gameId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'team_answers',
        filter: `game_id=eq.${gameId}`,
      },
      async () => {
        // Re-fetch toutes les réponses à chaque changement
        const fresh = await getTeamAnswers(gameId);
        callback(fresh);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

