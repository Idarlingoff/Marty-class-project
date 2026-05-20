# FRAP — Jeu de gestion des risques

Application web interactive pour une présentation orale autour de l'analyse et du traitement des risques.

## Stack

- **Vite** + **React** + **TypeScript**
- **Supabase** (base de données + temps réel)
- **Motion** v12 (`motion/react`) pour les animations
- **React Router** (HashRouter)
- Déploiement **GitHub Pages**

---

## Démarrage rapide

### 1. Variables d'environnement

```bash
cp .env.example .env.local
```

Éditez `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 2. Installer et lancer

```bash
npm install
npm run dev
```

### 3. Build

```bash
npm run build
```

---

## Base de données Supabase

Créez ces tables dans votre projet Supabase :

**games** : `id uuid PK`, `status text`, `credits int4`, `created_at timestamptz`

**fraps** : `id uuid PK`, `game_id uuid FK`, `code text`, `name text`, `criticality text`, `probability int4`, `impact int4`, `presenter_credits int4`, `created_at timestamptz`

**team_answers** : `id uuid PK`, `game_id uuid FK`, `team_number int4`, `answers jsonb`, `remaining_credits int4`, `created_at timestamptz`

> Activez **Realtime** sur `team_answers` dans Supabase → Table Editor → Replication.

---

## Déploiement GitHub Pages

1. `Settings → Pages → Source : GitHub Actions`
2. `Settings → Environments → prod` → ajouter les secrets :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Push sur `main` → déploiement automatique.

URL : `https://<username>.github.io/marty-class-project/`

---

## Règles du jeu

- **Présentateur** : crée la partie, configure les FRAP, lance la session.
- **Équipes (1–3)** : attribuent des crédits (0–3) par FRAP sans dépasser le budget.
- **Score** = réduction de risque totale / crédits utilisés.

### Réduction du risque par crédit
| Crédits | Effet |
|---|---|
| 1 | Impact −1 |
| 2 | Probabilité −1, Impact −1 |
| 3 | Probabilité −2, Impact −2 |
