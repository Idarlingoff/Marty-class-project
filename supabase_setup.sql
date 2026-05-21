-- ─────────────────────────────────────────────────────────────────────────────
-- FRAP — Script d'initialisation Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Création des tables (si elles n'existent pas encore) ──────────────────

CREATE TABLE IF NOT EXISTS games (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status     text NOT NULL DEFAULT 'setup',
  credits    int4 NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fraps (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id           uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  code              text NOT NULL,
  cycle             text NOT NULL DEFAULT '',
  title             text NOT NULL,
  criticality       text NOT NULL,
  probability       int4 NOT NULL CHECK (probability BETWEEN 1 AND 5),
  impact            int4 NOT NULL CHECK (impact BETWEEN 1 AND 5),
  presenter_credits int4 NOT NULL DEFAULT 0 CHECK (presenter_credits BETWEEN 0 AND 3),
  description       text NOT NULL DEFAULT '',
  credit_actions    jsonb NOT NULL DEFAULT '{"1":"","2":"","3":""}',
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_answers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id          uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  team_number      int4 NOT NULL CHECK (team_number BETWEEN 1 AND 3),
  answers          jsonb NOT NULL DEFAULT '{}',
  remaining_credits int4 NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id, team_number)
);

-- ── 2. Activer RLS sur les tables ────────────────────────────────────────────

ALTER TABLE games        ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraps        ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_answers ENABLE ROW LEVEL SECURITY;

-- ── 3. Politiques d'accès pour le rôle anonyme (clé publique) ───────────────
--    L'application utilise une clé "publishable" → rôle Supabase = anon

-- games
DROP POLICY IF EXISTS "anon_all_games" ON games;
CREATE POLICY "anon_all_games" ON games
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- fraps
DROP POLICY IF EXISTS "anon_all_fraps" ON fraps;
CREATE POLICY "anon_all_fraps" ON fraps
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- team_answers
DROP POLICY IF EXISTS "anon_all_team_answers" ON team_answers;
CREATE POLICY "anon_all_team_answers" ON team_answers
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- ── 4. Activer Realtime sur team_answers ─────────────────────────────────────
--    (nécessaire pour le dashboard temps réel du présentateur)

ALTER PUBLICATION supabase_realtime ADD TABLE team_answers;

-- ── Vérification ─────────────────────────────────────────────────────────────
SELECT tablename, rowsecurity FROM pg_tables
WHERE tablename IN ('games', 'fraps', 'team_answers');

-- ── Migration (si la table fraps existait déjà avec l'ancien schéma) ─────────
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query

-- 1. Renommer la colonne name → title (si elle existe encore)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fraps' AND column_name = 'name'
  ) THEN
    ALTER TABLE fraps RENAME COLUMN name TO title;
  END IF;
END $$;

-- 2. Ajouter la colonne cycle (si absente)
ALTER TABLE fraps
  ADD COLUMN IF NOT EXISTS cycle text NOT NULL DEFAULT '';

-- 3. Ajouter la colonne description (si absente)
ALTER TABLE fraps
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';

-- 4. Ajouter la colonne credit_actions (si absente)
ALTER TABLE fraps
  ADD COLUMN IF NOT EXISTS credit_actions jsonb NOT NULL DEFAULT '{"1":"","2":"","3":""}';

-- ── Vérification post-migration ───────────────────────────────────────────────
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'fraps'
ORDER BY ordinal_position;

