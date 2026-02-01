# Exercise Image Naming Guide

Place your exercise images in this folder using the filenames listed below.

## Naming Convention
- Lowercase letters
- Hyphens instead of spaces
- `.jpg` extension (or `.png` if preferred - update SQL accordingly)

## Required Images (62 exercises)

### Barbell (BB) - 17 images
| Exercise Name | Filename |
|--------------|----------|
| BB Back squat | `bb-back-squat.jpg` |
| BB Bent over row | `bb-bent-over-row.jpg` |
| BB Bicep curl | `bb-bicep-curl.jpg` |
| BB Deadlift | `bb-deadlift.jpg` |
| BB Front squat | `bb-front-squat.jpg` |
| BB Good morning | `bb-good-morning.jpg` |
| BB Hip thrust | `bb-hip-thrust.jpg` |
| BB Incline bench press | `bb-incline-bench-press.jpg` |
| BB Lying tricep extension | `bb-lying-tricep-extension.jpg` |
| BB Overhead press | `bb-overhead-press.jpg` |
| BB Preacher curl | `bb-preacher-curl.jpg` |
| BB Romanian deadlift | `bb-romanian-deadlift.jpg` |
| BB Shoulder shrug | `bb-shoulder-shrug.jpg` |
| BB Split squat | `bb-split-squat.jpg` |
| BB Sumo deadlift | `bb-sumo-deadlift.jpg` |
| BB Upright row | `bb-upright-row.jpg` |
| Bench press | `bench-press.jpg` |

### Cable - 6 images
| Exercise Name | Filename |
|--------------|----------|
| Cable Bicep curl | `cable-bicep-curl.jpg` |
| Cable Chest fly | `cable-chest-fly.jpg` |
| Cable Face pull | `cable-face-pull.jpg` |
| Cable Lat pulldown | `cable-lat-pulldown.jpg` |
| Cable Seated row | `cable-seated-row.jpg` |
| Cable Tricep pushdown | `cable-tricep-pushdown.jpg` |

### Dumbbell (DB) - 19 images
| Exercise Name | Filename |
|--------------|----------|
| DB Bench press | `db-bench-press.jpg` |
| DB Bicep curl | `db-bicep-curl.jpg` |
| DB Chest fly | `db-chest-fly.jpg` |
| DB Front raise | `db-front-raise.jpg` |
| DB Goblet squat | `db-goblet-squat.jpg` |
| DB Hammer curl | `db-hammer-curl.jpg` |
| DB Incline bench press | `db-incline-bench-press.jpg` |
| DB Incline curl | `db-incline-curl.jpg` |
| DB Lateral raise | `db-lateral-raise.jpg` |
| DB Lunge | `db-lunge.jpg` |
| DB Overhead press | `db-overhead-press.jpg` |
| DB Preacher curl | `db-preacher-curl.jpg` |
| DB Rear delt fly | `db-rear-delt-fly.jpg` |
| DB Romanian deadlift | `db-romanian-deadlift.jpg` |
| DB Row | `db-row.jpg` |
| DB Shoulder shrug | `db-shoulder-shrug.jpg` |
| DB Skull crusher | `db-skull-crusher.jpg` |
| DB Split squat | `db-split-squat.jpg` |
| DB Step up | `db-step-up.jpg` |
| DB Tricep kickback | `db-tricep-kickback.jpg` |

### EZ Bar - 3 images
| Exercise Name | Filename |
|--------------|----------|
| EZ Bar Bicep curl | `ez-bar-bicep-curl.jpg` |
| EZ Bar Preacher curl | `ez-bar-preacher-curl.jpg` |
| EZ Bar Skull crusher | `ez-bar-skull-crusher.jpg` |

### Kettlebell (KB) - 3 images
| Exercise Name | Filename |
|--------------|----------|
| KB Goblet squat | `kb-goblet-squat.jpg` |
| KB Swing | `kb-swing.jpg` |
| KB Turkish get-up | `kb-turkish-get-up.jpg` |

### Machine - 11 images
| Exercise Name | Filename |
|--------------|----------|
| Machine Cable crossover | `machine-cable-crossover.jpg` |
| Machine Calf raise | `machine-calf-raise.jpg` |
| Machine Chest press | `machine-chest-press.jpg` |
| Machine Hack squat | `machine-hack-squat.jpg` |
| Machine Lat pulldown | `machine-lat-pulldown.jpg` |
| Machine Leg curl | `machine-leg-curl.jpg` |
| Machine Leg extension | `machine-leg-extension.jpg` |
| Machine Leg press | `machine-leg-press.jpg` |
| Machine Pec fly | `machine-pec-fly.jpg` |
| Machine Seated row | `machine-seated-row.jpg` |
| Machine Shoulder press | `machine-shoulder-press.jpg` |

## After Adding Images

Run the migration to update the database:

```bash
cd /Users/kris.zhang/Github/bft-cloudflare
npm run db:migrate:images
```

Or manually:

```bash
npx wrangler d1 execute bft-workout-db --remote --file=./migrations/0003_add_image_urls.sql
```
