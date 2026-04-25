# STATUS — bft-cloudflare

_Auto-maintained by `/update-session-status`. Last updated: 2026-04-25 — Material Design redesign branch + design knowledge doc; D1 remote synced to local._

Operator briefing for this repository. Read FIRST when opening this repo in a new session — it reflects what's deployed, what's in flight, and what gotchas exist. For deeper context: see "What to read first" below.

## Production state

| Component | Where it runs | Last verified | Notes |
|---|---|---|---|
| Worker `bft-workout-tracker` | Cloudflare Workers (Hono framework) | 2026-04-25 | Serves API + static `public/` assets; deploys via `wrangler deploy` |
| D1 database `bft-workout-db` | Cloudflare D1 (id `d1f13f0f-…`) | 2026-04-25 | Migration 0008 applied; prod backup pair in `backups/` |
| Schema migration 0008 | Applied to remote D1 | 2026-04-25 | Denormalized `exercises.workout_count` + 3 triggers on `workout_logs` (insert/delete/update_exercise_id) |
| Static frontend (5 pages) | Bundled with worker via `[assets]` binding | 2026-04-25 | Vanilla HTML/CSS/JS, no build step, served from `public/` |

## Open threads

- **Material Design 3 redesign** — branch `material-design-revamp` (local, uncommitted). Adds `public/css/material.css` (~700 lines, M3 token + component overlay), Roboto + Material Symbols font links + theme-color updates on all 5 HTML pages, polish edits in progress on Log Workout / Library / Progress / All Workouts. Decision pending: commit + deploy vs. iterate further on palette/spacing.
- **Design knowledge doc** — `docs/design-system.md` (~219 lines, untracked). Captures framework evaluation (Material vs Fluent vs Preline vs TailGrids vs Untitled) and M3 implementation experimentation. Lives alongside `material.css`.
- **`.claude/launch.json`** — added for Claude Preview MCP to start `wrangler dev` on port 8787. Untracked.
- **Local D1 dev DB synced from remote** — `remote-dump.sql` (gitignored) imported via `sqlite3` direct (not `wrangler d1 execute`). Local has 63 exercises / 41 workout_logs / 23 plans / 6 stations matching prod snapshot.

## Known infrastructure quirks

- **`wrangler d1 execute --local --file=remote-dump.sql` fails with `SQLITE_TOOBIG`** — the prod dump contains base64 image rows that exceed SQLite's max statement size when wrangler executes them. Workaround: import via `sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite < remote-dump.sql` directly. Discovered while syncing remote → local.
- **`wrangler dev` recreates the local D1 sqlite file on first cold start** — importing data into the file before `wrangler dev` ever runs gets blown away. Workaround: let `wrangler dev` create the file once, then kill it, then `sqlite3`-import; subsequent restarts preserve the data.
- **`STATUS.md` and `status.md` collide on macOS APFS** (case-insensitive). The project's hand-maintained `status.md` (feature tracking per CLAUDE.md §1) lives at repo root. This auto-maintained operator briefing therefore lives at `docs/STATUS.md` to avoid overwriting it.
- **`GET /api/exercises` deliberately omits `image_url`** to keep list payloads ~24 KB instead of multi-MB. Frontend uses `has_image` flag + lazy per-id fetch via `IntersectionObserver` (see `lazyLoadCardImages()` in `library.html`). If you add a new column, update the explicit `SELECT` list in `getExercises` (`src/db.ts`) — never `SELECT *` here.
- **`exercises.workout_count` is trigger-maintained**, not computed. If you write to `workout_logs` outside the regular INSERT/DELETE/UPDATE paths (bulk import, `INSERT OR REPLACE`), verify counts or rerun the backfill SQL in CLAUDE.md "Architectural Patterns".

## What to read first (cold-start orientation)

1. `CLAUDE.md` — project rules, conventions, architectural patterns (image lazy-load, denormalized counts, N+1 avoidance for plans)
2. `status.md` — hand-maintained feature documentation + "Recent Changes (This Session)" log (project convention — must be kept in sync per CLAUDE.md §1)
3. `docs/design-system.md` — Material Design 3 framework evaluation + redesign experimentation log (active work)
4. `wrangler.toml` — D1 binding (`bft-workout-db`, id `d1f13f0f-…`) and assets config
5. `migrations/0008_denormalize_workout_count.sql` — most recent schema change; explains the trigger-maintained count invariant
