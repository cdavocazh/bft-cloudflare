# Claude Code Instructions for BFT Workout Tracker

> **Start here:** read `docs/STATUS.md` first — it's the operator briefing for what's currently deployed, in flight, and known to be quirky. Then continue with this file.

## Project Overview

BFT Workout Tracker is a mobile-first web application for tracking gym workouts, built with:
- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **Backend**: Cloudflare Workers with Hono framework
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Pages/Workers

## Project Structure

```
bft-cloudflare/
├── public/                    # Frontend files (served statically)
│   ├── index.html            # Log Workout page (main page)
│   ├── plan.html             # Workout Plan page
│   ├── library.html          # Workout Library (exercise management)
│   ├── progress.html         # Progress tracking with charts
│   ├── all-workouts.html     # Workout history browser
│   ├── css/
│   │   ├── style.css         # Base mobile-first styles (single file)
│   │   └── material.css      # M3 design overlay (loaded after style.css; see docs/design-system.md)
│   ├── js/
│   │   ├── api.js            # API client for backend calls
│   │   └── utils.js          # Utility functions (formatDate, showToast, etc.)
│   └── images/exercises/     # Exercise images (see IMAGE_NAMING_GUIDE.md)
├── src/
│   ├── index.ts              # Worker entry point (Hono router)
│   ├── db.ts                 # D1 query helpers (prepared statements)
│   ├── types.ts              # TypeScript types + shared constants
│   └── routes/
│       ├── exercises.ts      # /api/exercises/*
│       ├── workouts.ts       # /api/workouts/*
│       └── plans.ts          # /api/plans/*
├── migrations/               # D1 schema migrations (0001 → 0008)
├── backups/                  # Local D1 export dumps (gitignored)
├── docs/
│   ├── STATUS.md             # Operator briefing — read FIRST in new sessions
│   └── design-system.md      # Material Design 3 evaluation + redesign log
├── wrangler.toml             # Cloudflare config (worker + D1 binding)
├── status.md                 # Hand-maintained feature/change log (MUST UPDATE — see §1)
├── README.md                 # User-facing setup + API reference
└── CLAUDE.md                 # This file (project rules for Claude sessions)
```

## Key Development Patterns

### Frontend
- **No build step**: Plain HTML/CSS/JS, no bundler or transpiler
- **Mobile-first CSS**: Base styles for mobile, media queries for larger screens
- **Single CSS file**: All styles in `public/css/style.css`
- **API calls**: Use the `api` object from `api.js` (e.g., `api.getExercises()`)
- **Toast notifications**: Use `showToast(message, type)` where type is 'success', 'error', or 'info'
- **Date formatting**: Use `formatDate(dateString)` from utils.js

### Backend (Cloudflare Workers)
- **Framework**: Hono for routing
- **Database**: D1 with prepared statements
- **API prefix**: All endpoints under `/api/`
- **CORS**: Handled automatically

### CSS Conventions
- Use CSS custom properties from `:root` (e.g., `var(--primary-color)`)
- Form rows: `.form-row-compact` for 2-column, `.form-row-inline` for tight spacing
- Custom ratios: Create specific classes like `.form-row-type-branch` with flex ratios
- Touch targets: Minimum 44px height for mobile inputs

## Important Rules

### 1. Always Update Documentation
After making ANY significant code changes, you MUST update both:

**`status.md`** — for feature and change tracking:
- Add new features to the appropriate page's table
- Mark completed features with ✅ Done
- Add entry to "Recent Changes (This Session)" section at the bottom
- Update the "Last updated" date

**`CLAUDE.md`** — for significant structural or architectural changes:
- New API endpoints, pages, or major components
- Changes to project structure, conventions, or patterns
- New utility functions or shared helpers that future sessions should know about

Example status.md update:
```markdown
| New Feature Name | ✅ Done | Brief description |
```

And in Recent Changes:
```markdown
13. **Page Name**: Description of what was added/changed
```

### 2. Preserve Existing Functionality
- When modifying functions, preserve existing behavior unless explicitly asked to change
- When adding to dropdowns/selects, maintain existing options
- When editing CSS, don't break existing layouts

### 3. Mobile-First Approach
- Always consider mobile view first
- Test touch target sizes (minimum 44px)
- Use responsive units where appropriate

## Common Tasks

### Adding a New Form Field
1. Add HTML in the appropriate page
2. Add CSS if needed (prefer existing classes)
3. Update JavaScript to handle the field (load/save)
4. Update status.md

### Adding a Link Between Pages
1. Use proper href paths (e.g., `/library.html?exercise=${id}`)
2. Handle URL parameters in target page with `URLSearchParams`
3. Add CSS for link styling if needed

### Modifying Exercise Dropdown
- Dropdown rendered in `renderExerciseDropdown()` function
- Each option can have additional elements (like "lib" link)
- Use `onclick="event.stopPropagation()"` for nested clickable elements

## Architectural Patterns

### Exercise list response is "lite" — no `image_url`
`GET /api/exercises` deliberately omits `image_url` from each row to keep the response small (~24 KB instead of multi-MB of base64). It returns a `has_image` flag (`0|1`) so the frontend knows whether to render a thumbnail. To get the image, fetch the single exercise via `GET /api/exercises/:id` (which returns the full row including `image_url`).

When rendering thumbnails in a list (e.g. Library cards), use `IntersectionObserver` to lazy-load images per card via `api.getExercise(id)` only when the card scrolls into view. See `lazyLoadCardImages()` / `loadCardImage()` in `public/library.html` for the pattern.

If you add a new column to `exercises` and want it in the list response, add it to the explicit `SELECT` list in `getExercises` (`src/db.ts`). Avoid `SELECT *` here — that's how `image_url` was leaking into the list before.

### `exercises.workout_count` is denormalized
The `workout_count` column on `exercises` is maintained by triggers on `workout_logs` (see migration `0008`):
- `trg_workout_logs_after_insert` — increments on new log
- `trg_workout_logs_after_delete` — decrements on log delete
- `trg_workout_logs_after_update_exercise_id` — re-balances if a log moves between exercises

If you add a new path that writes to `workout_logs` outside the regular `INSERT`/`DELETE`/`UPDATE` patterns (e.g. a bulk import or an `INSERT OR REPLACE`), verify the count stays correct or update it manually. If you ever truncate or seed `workout_logs` directly, re-run the backfill:

```sql
UPDATE exercises SET workout_count = (SELECT COUNT(*) FROM workout_logs WHERE exercise_id = exercises.id);
```

### N+1 avoidance for plans + stations
`GET /api/plans` uses `getStationsForPlans(planIds)` (one `IN (...)` query) — do NOT loop `getWorkoutPlanStations(planId)` per plan. The single-plan endpoint (`GET /api/plans/:date`) is fine to use the per-plan helper because it's a single call.

## Database Migrations & Backups

- Migrations live in `migrations/NNNN_*.sql` and are applied via `wrangler d1 execute bft-workout-db --remote --file=...`
- Always test migrations on local first with `--local` instead of `--remote`
- Before any prod schema change, take a backup: `wrangler d1 export bft-workout-db --remote --output=./backups/prod-backup-pre-NNNN-$(date +%Y%m%d-%H%M%S).sql`
- Backups go in `backups/` (gitignored) — never commit them, they contain personal workout data
- Apply schema migration BEFORE deploying worker code that depends on the new schema, so the currently-running old worker keeps working through the gap

## API Endpoints Reference

```javascript
// Exercises
api.getExercises(params)     // { category?, equipment_type?, muscle_main? }
api.getExercise(id)
api.createExercise(data)
api.updateExercise(id, data)
api.deleteExercise(id)
api.getExerciseLatest(id)    // Get last workout for exercise

// Workouts
api.getWorkouts(params)      // { exercise_id?, category?, workout_date?, limit? }
api.createWorkout(data)
api.updateWorkout(id, data)
api.deleteWorkout(id)
api.getProgression(exerciseId)
api.exportWorkouts()

// Plans
api.getPlans(limit)
api.getPlan(date)
api.createPlan(data)
api.deletePlan(date)

// Constants
api.getConstants()           // Returns categories, equipment_types, preset_sets, etc.

// Weight
api.getWeightOptions(equipmentType)
```

## Testing Changes

Since there's no build step:
1. Run `wrangler dev` for local development
2. Changes to HTML/CSS/JS are immediate (refresh browser)
3. Backend changes require worker restart

## Deployment

```bash
wrangler deploy
```

## Session Checklist

Before ending a session, ensure:
- [ ] All requested features are implemented
- [ ] status.md is updated with all feature and code changes
- [ ] CLAUDE.md is updated if any significant structural changes were made
- [ ] No console errors in browser
- [ ] Mobile layout is not broken
