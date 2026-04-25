# BFT Workout Tracker - Cloudflare Edition

A workout tracking application built with TypeScript, Hono framework, and Cloudflare D1 database, deployed on Cloudflare Workers.

## Architecture

- **Frontend**: Static HTML/CSS/JS served via Cloudflare Pages
- **Backend**: Hono framework running on Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite-compatible)

## Project Structure

```
bft-cloudflare/
├── src/
│   ├── index.ts              # Main Hono app entry point
│   ├── types.ts              # TypeScript types and shared constants
│   ├── db.ts                 # D1 query helpers (prepared statements)
│   └── routes/
│       ├── exercises.ts      # Exercise API routes
│       ├── workouts.ts       # Workout log API routes
│       └── plans.ts          # Workout plan API routes
├── public/                   # Static files served by Workers
│   ├── index.html            # Log workout page
│   ├── plan.html             # Workout planning
│   ├── library.html          # Exercise library
│   ├── progress.html         # Progress tracking
│   ├── all-workouts.html     # Workout history
│   ├── css/
│   │   ├── style.css         # Base mobile-first styles
│   │   └── material.css      # M3 design overlay (see docs/design-system.md)
│   ├── js/
│   │   ├── api.js            # API client
│   │   └── utils.js          # Utility functions
│   └── images/exercises/     # Exercise images (see IMAGE_NAMING_GUIDE.md)
├── migrations/               # 0001 → 0008 schema + data migrations
├── backups/                  # Local D1 export dumps (gitignored)
├── docs/
│   ├── STATUS.md             # Operator briefing (deployed state, in-flight work, quirks)
│   └── design-system.md      # Material Design 3 evaluation + redesign log
├── package.json
├── tsconfig.json
├── wrangler.toml             # Cloudflare configuration (worker + D1 binding)
├── status.md                 # Hand-maintained feature/change log
├── CLAUDE.md                 # Session rules for Claude Code
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Quick Start

### 1. Install Dependencies

```bash
cd bft-cloudflare
npm install
```

### 2. Create D1 Database

```bash
# Create the database
npm run db:create

# This outputs a database_id - copy it!
```

### 3. Update Configuration

Edit `wrangler.toml` and replace `YOUR_DATABASE_ID_HERE` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "bft-workout-db"
database_id = "your-actual-database-id"
```

### 4. Run Migrations

```bash
# For local development
npm run db:setup:local

# For production
npm run db:setup
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:8787

### 6. Deploy to Production

```bash
npm run deploy
```

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:create` | Create a new D1 database |
| `npm run db:migrate` | Run schema migration (production) |
| `npm run db:migrate:local` | Run schema migration (local) |
| `npm run db:seed` | Seed exercises (production) |
| `npm run db:seed:local` | Seed exercises (local) |
| `npm run db:setup` | Run migrate + seed (production) |
| `npm run db:setup:local` | Run migrate + seed (local) |

## API Endpoints

### Exercises

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List exercises (with filters) |
| GET | `/api/exercises/search?q=` | Search exercises |
| POST | `/api/exercises` | Create exercise |
| GET | `/api/exercises/:id` | Get single exercise |
| PUT | `/api/exercises/:id` | Update exercise |
| DELETE | `/api/exercises/:id` | Delete exercise |
| GET | `/api/exercises/:id/latest` | Get latest workout |

### Workouts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get workout history |
| POST | `/api/workouts` | Log a workout |
| GET | `/api/workouts/:id` | Get single workout |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/workouts/progression/:id` | Get exercise progression |
| GET | `/api/workouts/export` | Export all workouts |

### Workout Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | Get recent plans |
| GET | `/api/plans/:date` | Get plan for date |
| POST | `/api/plans` | Create/update plan |
| DELETE | `/api/plans/:date` | Delete plan |

### Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/constants` | Get app constants |
| GET | `/api/weight-options/:type` | Get weight options |
| GET | `/api/health` | Health check |

## Features

- **Log Workouts**: Track weight, reps, sets with equipment-specific weight presets
- **Exercise Library**: 60+ pre-loaded exercises with category/muscle filtering
- **Workout Planning**: Plan daily workouts with station-based format
- **Progress Tracking**: View exercise progression with charts
- **Mobile Optimized**: Responsive design for gym use
- **Offline Capable**: Static frontend works offline (API requires connection)

## Development

### TypeScript Type Checking

```bash
npm run typecheck
```

### Local Database Access

The local D1 database is stored in `.wrangler/state/`. You can inspect it using any SQLite client.

### Adding New Exercises

Edit `migrations/0002_seed.sql` and add new INSERT statements, then run:

```bash
npm run db:seed:local  # or db:seed for production
```

## Deployment

### First-Time Setup

1. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

2. Create database and update wrangler.toml (see Quick Start)

3. Run production migrations:
   ```bash
   npm run db:setup
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

### Subsequent Deployments

```bash
npm run deploy
```

### Custom Domain

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to Settings → Triggers → Custom Domains
4. Add your domain

## Differences from Python/FastAPI Version

| Feature | FastAPI Version | Cloudflare Version |
|---------|-----------------|-------------------|
| Language | Python | TypeScript |
| Framework | FastAPI | Hono |
| Database | SQLite/Postgres | Cloudflare D1 |
| Templating | Jinja2 (server-side) | Static HTML (client-side) |
| Hosting | Self-hosted/Vercel | Cloudflare Workers |
| Cold starts | Varies | ~0ms |
| Image uploads | Local filesystem | Implemented (base64 → D1 + lazy fetch) |

Image uploads are stored as base64 in the `exercises.image_url` column. To keep `GET /api/exercises` payloads small (~24 KB instead of multi-MB), the list endpoint omits `image_url` and exposes a `has_image` flag; the frontend lazy-fetches each image via `GET /api/exercises/:id` only when its card scrolls into view (see `lazyLoadCardImages()` in `public/library.html`).

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- D1: 5GB storage, 5M rows read/day, 100K rows written/day

For personal workout tracking, the free tier is more than sufficient.

## Troubleshooting

### "D1_ERROR: no such table"

Run the migrations:
```bash
npm run db:setup:local  # for local
npm run db:setup        # for production
```

### "Binding DB not found"

Make sure `wrangler.toml` has the correct database_id and you've created the database with `npm run db:create`.

### Changes not appearing

Clear your browser cache or hard refresh (Ctrl+Shift+R).

## Documentation

| Document | Audience | What it covers |
|---|---|---|
| [`docs/STATUS.md`](docs/STATUS.md) | Anyone opening this repo cold | Operator briefing — what's deployed, what's in flight, known quirks. Read first. |
| [`docs/design-system.md`](docs/design-system.md) | Anyone working on UI | Material Design 3 framework evaluation + active redesign experimentation log. |
| [`status.md`](status.md) | Maintainers | Hand-maintained feature catalog and per-session change log (per CLAUDE.md §1). |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code sessions | Session rules, conventions, architectural patterns, deployment commands. |
| [`public/images/exercises/IMAGE_NAMING_GUIDE.md`](public/images/exercises/IMAGE_NAMING_GUIDE.md) | Image contributors | Required filenames + naming convention for exercise thumbnails. |

## License

MIT
