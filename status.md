# BFT Workout Tracker - Feature Documentation

A mobile-first web application for tracking gym workouts, built with Cloudflare Workers + D1 database.

---

## Architecture

**Stack**: Vanilla HTML/CSS/JS frontend, Cloudflare Workers backend, D1 (SQLite) database

```
bft-cloudflare/
├── public/                     # Frontend (static files)
│   ├── index.html              # Log Workout
│   ├── plan.html               # Workout Plan
│   ├── library.html            # Exercise Library
│   ├── progress.html           # Progress Tracking
│   ├── all-workouts.html       # Workout Records
│   ├── css/style.css           # Mobile-first styles
│   └── js/
│       ├── api.js              # API client
│       └── utils.js            # Utilities
├── src/
│   ├── index.ts                # Worker entry point
│   ├── db.ts                   # Database operations
│   ├── types.ts                # TypeScript types
│   └── routes/                 # API route handlers
├── migrations/                 # D1 schema migrations
├── wrangler.toml               # Cloudflare config
└── CLAUDE.md                   # Claude Code project instructions
```

---

## Pages

### 1. Log Workout (`index.html`)
Main page for logging individual workout sets.

**Core Features:**
- Exercise search with autocomplete (searches all exercises globally)
- Category and equipment type filters
- Preset sets: Standard (fixed reps) or Variable (different reps per set)
- Weight dropdown filtered by exercise min/max range
- "adj" buttons to copy first set value to all sets
- Suggested weight from last workout
- Exercise image display
- "With cadence" tag toggle
- Recent workouts section with filter toggle
- CSV export

**Navigation:**
- "progress" link per exercise → jumps to Progress page for that exercise
- "lib" link per exercise → jumps to Library with exercise highlighted
- "Browse Library" link → opens Library page

### 2. Workout Plan (`plan.html`)
Daily workout planning with station-based structure.

**Core Features:**
- Date picker with auto-load existing plan
- Theme input (searchable dropdown with "add new" option)
- Workout Type dropdown
- Branch input with history dropdown
- Collapsible stations (3 default, first expanded)
- Per-station: equipment filter, exercise search, sets, time, notes
- "More" toggle shows exercises NOT matching equipment filter
- "Add to library" when no exercise match found
- Save/Delete buttons (2:1 width ratio)
- Recent plans list with click-to-load

### 3. Exercise Library (`library.html`)
Exercise management and browsing.

**Core Features:**
- Filters: Category, Equipment (auto-hides empty), Muscle group
- Search by name
- Exercise count display
- Exercise cards with:
  - Image (upload file or URL)
  - Category, equipment type, muscles
  - Workout log count badge
  - Quick log (+1) → jumps to Log Workout with exercise pre-selected
  - View Logs → jumps to Workout Records filtered
  - Progress → jumps to Progress page for that exercise
  - Edit button
- Add/Edit exercise modal:
  - Name, categories (multi-select checkboxes), subcategory
  - Equipment type
  - Primary/secondary muscles
  - Min/Max weight range
  - Image management

### 4. Progress (`progress.html`)
Exercise progression tracking with charts.

**Core Features:**
- Category and exercise filters
- Overview bar chart (top 10 most logged exercises, shown when no exercise selected)
- Chart.js line chart (weight over time for selected exercise)
- +1 button to quickly log new workout for selected exercise
- Statistics: total workouts, max weight, latest weight
- Workout history list (last 10, weight only, clickable → jumps to Workout Records)
- Deep link from Workout Records and Log Workout

### 5. Workout Records (`all-workouts.html`)
Browse and manage workout history.

**Core Features:**
- Collapsible "Workout Plans" section (click plan → filter by date)
- Filters: date, category, exercise, search (with debounce)
- Compact workout cards (title + category visible, expand for details)
- Per-workout: weight × reps × sets, tags, notes
- Actions: Progress, Edit, Delete (compact buttons)
- Deep link from Library

**Performance Optimizations:**
- Default limit of 50 workouts (prevents page freezing)
- Parallel API calls on page load
- Loading state protection against double-requests
- Debounced search input (150ms delay)

---

## UI/UX

- **Mobile-first** responsive design
- **Dark mode** via CSS media query
- **Touch-friendly** inputs (min 44px targets)
- **Hamburger menu** on mobile
- **Toast notifications** for feedback
- **Loading states** and indicators
- **Modal dialogs** for editing
- **Safe area** support for notched devices

---

## Backend API

**Base**: `/api/*` with CORS enabled

### Exercises
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exercises` | GET | List with filters (category, equipment, muscle) |
| `/api/exercises/:id` | GET | Single exercise details |
| `/api/exercises` | POST | Create exercise |
| `/api/exercises/:id` | PUT | Update exercise |
| `/api/exercises/:id` | DELETE | Delete (fails if has logs) |
| `/api/exercises/:id/latest` | GET | Last workout for exercise |
| `/api/exercises/search?q=` | GET | Search by name |
| `/api/exercises/muscles` | GET | Unique muscle values |

### Workouts
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workouts` | GET | List with filters (date, category, exercise) |
| `/api/workouts/:id` | GET | Single workout |
| `/api/workouts` | POST | Log workout |
| `/api/workouts/:id` | PUT | Update workout |
| `/api/workouts/:id` | DELETE | Delete workout |
| `/api/workouts/progression/:exerciseId` | GET | Exercise progression data |
| `/api/workouts/export` | GET | CSV export |

### Plans
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plans` | GET | Recent plans (limit param) |
| `/api/plans/:date` | GET | Plan for specific date |
| `/api/plans` | POST | Save plan with stations |
| `/api/plans/:date` | DELETE | Delete plan |
| `/api/plans/branches` | GET | Unique branch values |

### Utilities
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/constants` | GET | App constants (categories, themes, etc.) |
| `/api/weight-options/:equipment` | GET | Weight options for equipment type |
| `/api/upload-image` | POST | Upload image as base64 |
| `/api/health` | GET | Health check |

---

## Data Model

### Exercise
```
id, name, category, subcategory, equipment_type,
muscle_main, muscle_additional, image_url,
weight_min, weight_max, created_at
```

### Workout Log
```
id, exercise_id, weight_kg, reps, sets,
workout_date, notes, tags, created_at
```

### Workout Plan
```
id, plan_date, theme, workout_type, branch,
description, created_at
```

### Workout Plan Station
```
id, plan_id, station_number, exercise_name,
set_arrangement, station_time, notes, created_at
```

---

## Weight System

Weight options are generated based on equipment type increment:

| Equipment | Increment |
|-----------|-----------|
| BB (Barbell) | 2.5 kg |
| DB (Dumbbell) | 2 kg |
| KB (Kettlebell) | 4 kg |
| Machine | 5 kg |
| Trap Bar | 5 kg |
| Bodyweight | N/A (0 kg only) |

Each exercise can define a **min/max weight range** to limit the dropdown options. The weight options start from the exercise's min weight (or 0 if not set) up to the max weight, using the equipment's increment.

---

## Development

```bash
# Local development
npm run dev        # or: wrangler dev

# Database migrations
wrangler d1 migrations apply bft-tracker-db --local
wrangler d1 migrations apply bft-tracker-db --remote

# Deploy
wrangler deploy
```

---

## Recent Changes (This Session)

1. **Log Workout (index.html)**: Fixed submit button requiring multiple presses - added loading state with button disable during submission
2. **All Pages**: Fixed empty error toast messages - now show actual error message from API responses
3. **All Pages**: Added console.error logging for all error handlers to help debug issues in production
4. **Plan (plan.html)**: Branch and Theme dropdowns now show saved values from previous plans
5. **CSS (style.css)**: Added dropdown arrow indicator to branch and theme input fields
6. **Plan (plan.html)**: Added theme filter to Recent Plans section
7. **Plan (plan.html)**: Added "Copy" button (green) next to Plan title - duplicates current plan to today's date
8. **Progress (progress.html)**: +1 button now shows for exercises without any logs
9. **Plan (plan.html)**: Theme dropdown values ranked by usage count (most used first)
10. **CSS (style.css)**: Theme filter in Recent Plans is now one-third width
11. **Plan (plan.html)**: Added "No-Show" toggle button next to Workout Type row
12. **Database**: Added `no_show` column to workout_plans table (migration 0005)
13. **Workout Records (all-workouts.html)**: Added "Branch Breakdown" section showing visit frequency by branch with configurable date filter (30/90/180/365 days)
14. **Workout Records (all-workouts.html)**: Moved "No-Show" toggle from Plan tab to Workout Records tab (next to Branch Breakdown title)
15. **Workout Records (all-workouts.html)**: Added "Incl. no-show" toggle to Branch Breakdown section to include/exclude no-show plans from statistics
16. **CSS (style.css)**: No-Show button turns red when active
17. **Workout Records (all-workouts.html)**: Added pagination controls to Workouts section header (page input with prev/next buttons)
18. **Workout Records (all-workouts.html)**: Workout cards now show inline date (dd/mm/yy format) next to exercise title instead of date grouping
19. **Workout Records (all-workouts.html)**: Category tags now display in short form (Upper Body → UB, Lower Body → LB, etc.)
20. **Plan (plan.html)**: Changed theme input placeholder from "Select or type theme..." to "Select"
21. **CSS (style.css)**: Changed form input border-radius to 4px (more rectangular appearance)
22. **Workout Records (all-workouts.html)**: Fixed collapse/expand triangle not being responsive (moved event.stopPropagation to pagination controls only)
23. **Database**: Added `weight_increment`, `reps_min`, `reps_max` columns to exercises table (migration 0006)
24. **Library (library.html)**: Added Weight Increment field to exercise edit modal - allows custom increment per exercise instead of using equipment default
25. **Library (library.html)**: Added Min/Max Reps fields to exercise edit modal - allows setting rep range per exercise
26. **Workout Records (all-workouts.html)**: Branch Breakdown section is now collapsible and collapsed by default for better screen space efficiency
27. **Log Workout (index.html)**: Changed reps input from number input to dropdown menu (1-20 options) for both standard and variable modes
28. **Workout Records (all-workouts.html)**: Workout card titles now show weight (e.g., "15kg") inline without needing to expand
29. **Workout Records (all-workouts.html)**: Removed bold from exercise names in workout cards for cleaner appearance
30. **Progress (progress.html)**: Added "Lib" button in Statistics section header - links to exercise's Library page for quick access to edit exercise details
31. **Library (library.html)**: Fixed weight increment input to accept 0.25 increments (allows 1.25kg etc.)
32. **Workout Records (all-workouts.html)**: Aligned category tag and weight to the right side of workout card title row
33. **Log Workout (index.html)**: Fixed weight selection using integer math to avoid floating-point rounding errors (e.g., 15 + 2.5 now correctly shows 17.5, not 17)
34. **Log Workout (index.html)**: Weight selection now uses exercise-specific weight_increment if set, falling back to equipment type default
35. **Progress (progress.html)**: Clicking a workout in history now opens the Edit Workout modal directly in Workout Records
36. **Workout Records (all-workouts.html)**: Workout card now shows last set weight instead of weighted average for variable workouts
37. **Log Workout (index.html)**: Changed "Weight per Set (kg)" label to "Weight for Set (kg)"
38. **Database**: Added `measure_type` column to exercises table (migration 0007) - values: 'Rep' (default) or 'Time'
39. **Library (library.html)**: Added "Rep / Time" dropdown to exercise edit modal - configures whether exercise tracks reps or time in seconds
40. **Log Workout (index.html)**: "Reps per Set (or side)" label dynamically changes to "Time(s) per Set (or side)" for time-based exercises; time inputs use number fields (seconds) instead of 1-20 dropdowns
41. **CSS (style.css)**: Fixed dark mode colors for expanded workout log details in All Workouts tab - changed white background (#fafafa) to dark (#2a2a2a) with bright text, also fixed dark mode for category tags, modal, dropdowns, pagination inputs, and other elements
42. **Log Workout (index.html)**: "Last workout" display now shows heaviest weight (parsed from variable notes) instead of averaged weight, with new format: "22.5kg | 8 reps x 3 sets"
43. **Log Workout (index.html)**: Recent workouts section items now navigate to the Edit Workout modal directly in Workout Records tab (fixed issue where Workouts section was collapsed, making highlighted workout invisible)
44. **Workout Records (all-workouts.html)**: Faster redirect when opening a specific workout - edit modal now opens immediately without waiting for page data to load (was waiting for 5 API calls); also auto-expands Workouts section for viewWorkoutId navigation
45. **Log Workout (index.html)**: Parallelized page init - loadConstants + global exercises fetch now run in parallel (was sequential); saves ~1 API round trip on every page load
46. **Log Workout (index.html)**: Parallelized selectExercise - getExercise, getWeightOptions, and getExerciseLatest now run in parallel (was 3 sequential calls); extracted buildWeightDropdown helper to avoid redundant API call
47. **Progress (progress.html)**: Parallelized page init - loadConstants + loadExercises now run in parallel; when redirected with exercise ID, progression data loads simultaneously with page setup instead of waiting for dropdowns first
48. **Log Workout (index.html)**: Exercise search dropdown now debounced (100ms) and limited to 20 items max with "type to narrow" hint - eliminates lag from rendering large exercise lists on every keystroke
49. **Progress (progress.html)**: Workout history now shows heaviest weight (parsed from variable workout notes) instead of averaged weight for each record
50. **Progress (progress.html)**: Overview "Most Logged Exercises" chart now renders instantly from cached exercise data instead of making a duplicate `getExercises` API call
51. **Documentation (CLAUDE.md)**: Added rule requiring CLAUDE.md updates for significant structural/architectural code changes alongside status.md updates; updated session checklist accordingly
52. **Log Workout (index.html)**: Added "progress" link beside each exercise option in the exercise dropdown, linking directly to the progress page for that exercise; progress.html now supports `?exercise=ID` URL parameter
53. **Workout Records (all-workouts.html)**: Changed per-workout "Progress" button label to "View Progress" for clarity
54. **Library (library.html)**: Added "Progress" button to each exercise card actions, linking to the Progress page for that exercise
55. **Log Workout (index.html)**: Made recent workout entries expandable inline — clicking shows weight/reps/sets, notes, tags, and an Edit button instead of redirecting to Workout Records
56. **Progress (progress.html)**: Made workout history entries expandable inline (same accordion pattern as Log Workout) instead of redirecting to Workout Records
57. **Log Workout (index.html)**: Shortened exercise dropdown links — "progress" → "Prog", "lib" → "Lib"
58. **Plan (plan.html)**: Added "History" button next to "Recent Plans" heading — opens a modal showing all branch visit history grouped by branch with dates and themes; clicking an entry navigates to that plan
59. **Backend (plans.ts)**: Added `/api/plans/branch-history` endpoint returning plans grouped by branch name
60. **Plan (plan.html)**: Branch History modal now has "By Branch" / "By Date" view toggle — By Date shows all entries chronologically with branch label shown inline
61. **Plan (plan.html)**: Each branch history entry now has an edit (✎) button to update the branch name for that plan without affecting stations; updates cached view immediately
62. **Backend (plans.ts + db.ts)**: Added `PATCH /api/plans/:date` endpoint and `updateWorkoutPlanBranch` DB function for branch-only plan updates
63. **Plan (plan.html)**: Added second "+ Add Station" button below the stations list (above Save/Delete) for easier access when many stations are shown
64. **Plan (plan.html)**: Branch History modal now has a year-month filter dropdown — auto-populated from available data, filters entries client-side across both views
65. **Plan (plan.html)**: Recent Plans items now show the branch name as a styled pill between date and theme
66. **Plan (plan.html)**: Branch History modal now paginates at 15 entries per page with Prev/Next controls; page resets on view or filter change
67. **Progress (progress.html)**: Replaced exercise `<select>` dropdown with a searchable text input + dropdown (same pattern as Log Workout tab) — supports debounced search, max 20 items shown, category filter applies to search results
68. **Database (migration 0008)**: Denormalized `workout_count` onto `exercises` table — added column, backfilled, and added 3 triggers on `workout_logs` (insert/delete/update of exercise_id) to maintain it. Eliminates the LEFT JOIN aggregation `getExercises` was doing on every list call.
69. **Backend (db.ts + types.ts)**: `getExercises` now selects explicit columns (no more `SELECT e.*`) and **excludes `image_url`** from the list response — drops the multi-MB base64 payload that was causing perceived lag on the Log Workout tab. Added `has_image` flag (`0|1`) so the frontend knows whether to render a thumbnail placeholder. Single-exercise endpoint (`GET /api/exercises/:id`) still returns `image_url`.
70. **Backend (plans.ts + db.ts)**: Added `getStationsForPlans(planIds)` batch helper using `IN (...)`; `GET /api/plans` no longer issues one stations query per plan (was running 443×/24h). Now one query for the listed plans.
71. **Library (library.html)**: Cards render without inline base64 images. After list render, `IntersectionObserver` lazy-fetches each card's image via `GET /api/exercises/:id` when the card scrolls into view (with in-memory cache so re-renders don't refetch). Cards without images show the existing "+ Add Image" placeholder unchanged.
72. **Log Workout (index.html)**: `selectExercise` now falls back to the per-id fetch's `image_url` when none was passed (since the list no longer carries it). Dropdown selection still shows the image — just sourced from the single-exercise endpoint instead of the list payload.
73. **Backups (.gitignore)**: Added `backups/` and `prod-backup*.sql` to gitignore — D1 export dumps stay local and out of git.
74. **Material redesign (material.css)**: Mobile nav dropdown was unreadable — `.nav-link` was forced to dark Material text color while `.nav-links` mobile background was `--primary-dark` (deep blue). Added a `@media (max-width: 768px)` block in material.css that sets the mobile nav background to `--md-surface-container` (light) with `--md-on-surface` text — proper contrast.
75. **Material redesign (material.css)**: Reduced heading sizes for tighter mobile feel — h1 1.75rem → 1.5rem, h2 1.375rem → 1.125rem, h3 1.125rem → 1rem, h4 1rem → 0.9375rem; modal-header h3 1.5rem → 1.25rem. Sizes now closer to the pre-redesign experience.
76. **Material redesign (material.css)**: Reduced input/select padding (0.75/0.875rem → 0.5/0.75rem) and min-height (48px → 38px). Form fields are more compact on mobile while still touch-friendly.
77. **Library (library.html)**: Removed the floating Material "+ New Exercise" FAB. The existing inline "+ Add Exercise" button in the section header is still the entry point for creating exercises.
78. **Library (library.html)**: Cards no longer show a "+ Add Image" placeholder for exercises without images — the image area is hidden entirely, making cards much tighter. Image upload now lives inside the Edit Exercise modal: an "Image" section shows a preview + Change/Remove buttons when an image exists, or a single "+ Add Image" button when it doesn't. Add-Exercise mode hides the section since images can only be attached to existing exercises. Upload/save/delete refresh the modal preview in place via `refreshExerciseModalImage()`.
79. **Library (material.css)**: Bumped `#image-modal` z-index to 1100 (above the default `.modal` z-index 1000). Without this, the image-modal opened from inside the Edit Exercise modal was hidden behind the exercise-modal due to DOM order — buttons appeared unresponsive.
80. **Workout Records (all-workouts.html + material.css)**: Replaced the square page-jump number input with a tappable page label (Option B). Default state shows compact `1` with a dashed-border affordance; tap (or focus + Enter/Space) flips it into an inline number input that commits on blur or Enter. Esc cancels. The bottom Prev/Next pagination remains. Solves the clunky 36×38px square.
81. **Progress (material.css)**: Compacted the Statistics grid — `repeat(auto-fit, minmax(140px, 1fr))` (often 2 boxes per row + 1 below) → `repeat(3, minmax(0, 1fr))` so all three metrics (Total Workouts / Max Weight / Latest) fit on a single row on mobile. Reduced padding 1rem → 0.5rem, stat-value 1.75rem → 1.125rem, stat-label 0.75rem → 0.65rem with ellipsis.
82. **Documentation (docs/STATUS.md)**: New auto-maintained operator briefing at `docs/STATUS.md` (created via `/update-session-status`). Captures production state (worker, D1, migration 0008), open threads (Material redesign branch, design knowledge doc, local D1 sync), and known infrastructure quirks (SQLITE_TOOBIG on `wrangler d1 execute`; `wrangler dev` reset behavior; STATUS.md case-collision with status.md on APFS). Read first when opening the repo cold.
83. **Documentation (docs/design-system.md)**: New design knowledge doc capturing the framework evaluation (Material vs Fluent vs Preline vs TailGrids vs Untitled UI — free-tier-only filter), the M3 overlay architecture decision, color seed change (`#64B5F6` → `#1B5EFA`), tokens implemented, components restyled, and lessons learned. Self-contained — readable cold without chat history.
84. **Documentation (CLAUDE.md)**: Added "Start here" pointer at the top referencing `docs/STATUS.md`, and refreshed the Project Structure tree to include `docs/`, `migrations/`, `backups/`, expanded `src/routes/`, `material.css`, and `public/images/exercises/`.
85. **Documentation (README.md)**: Updated Project Structure tree to match reality (8 migrations, `docs/` folder, `material.css`, `CLAUDE.md`, `status.md`); corrected the stale "Image uploads not implemented" claim in the FastAPI-comparison table; added a new Documentation section linking `docs/STATUS.md`, `docs/design-system.md`, `status.md`, `CLAUDE.md`, and `IMAGE_NAMING_GUIDE.md` (which was orphaned before).
86. **Local dev DB (sync from remote)**: Pulled production D1 dump via `wrangler d1 export bft-workout-db --remote --output=remote-dump.sql` and imported into local Miniflare sqlite via `sqlite3` direct (NOT `wrangler d1 execute --file`, which fails with `SQLITE_TOOBIG` on rows containing base64 images). Local now mirrors prod: 63 exercises / 41 workout_logs / 23 plans / 6 stations.
87. **Progress (progress.html + material.css)**: Added pagination to the Workout History section (was hard-sliced to the 10 most recent records — older entries were unreachable). Same pattern as Workout Records: tappable page label + Prev/Next inline with the "Workout History" h3, plus Prev/Next at the bottom when more than one page exists. Page size 10. `currentPage` resets to 1 on every exercise switch in `loadProgression()`. New `.history-header` flex layout in material.css aligns the title and pagination controls on one row.
88. **Backend (db.ts) — bug fix**: `createExercise` was stuffing the comma-joined category list into the singular `category` column (e.g., `"Lower Body,Whole Body"`) and leaving `categories` NULL. This caused workout records to show the literal joined string instead of the short form (`UB`/`LB`/`WB`). Fixed: now writes `categories[0]` to `category` and the full join to `categories`, matching the existing `updateExercise` shape. Cleaned up the only existing bad row in prod (id 65, "DB Suitcase DL") with a one-shot UPDATE.
89. **Workout Records (all-workouts.html) — defensive frontend**: `getCategoryShort` now splits comma-joined input and abbreviates each part (`"Lower Body,Whole Body"` → `"LB/WB"`). Robust against any future regression of the same shape.
90. **Library (style.css)**: Exercise card images now use `object-fit: contain` (was `cover`) so the whole picture is visible — important for diagram-style exercise images that were previously being cropped. Added a neutral background so any letterboxing matches the card.
91. **Plan (plan.html + material.css)**: Recent Plans rows now use a 3-column grid layout (`5.5rem | 5.5rem | 1fr` = date | branch | theme), so branches are vertically aligned across rows even when some plans have no branch. Branch span is always rendered (empty when none) and the empty-pill background is hidden via `:empty`.
92. **Plan (material.css)**: Recent Plans section header (h2 + History button + Themes filter) was overflowing the card on mobile because `.section-header-actions` had `flex-shrink: 0` and the select had `min-width: 100px` plus material.css's `padding-right: 2.5rem` for the dropdown arrow. Allowed the actions row to shrink/wrap and capped select at `max-width: 9rem`. Now wraps cleanly to a second line on narrow screens, no horizontal overflow.
93. **Workout Records (material.css) — Branch Breakdown header**: Title was wrapping to two lines and the days-filter dropdown was visibly shrinking when the user picked a shorter option (e.g. "Last 30 days" rendered narrower than "Last 90 days") because the universal `select { width: auto }` sized to selected text. Tightened the collapsible header: h2 1.125rem → 1rem with ellipsis, kept layout `flex-wrap: nowrap`, gave the days select a fixed `width: 7.5rem` (120px) plus tighter padding (0.25/0.5rem) and 32px min-height. Width now stable across all four options (30/90/180/365 days) — verified.
94. **Workout Records (material.css) — bracket spacing in 'Workouts(N)' header**: The `Workouts(<span>41</span>)` h2 was rendering as `Workouts(  41  )` with visible gaps inside the brackets. Cause: `.collapsible-header h2 { display: flex; gap: 0.5rem }` was adding flex gap between every child, including anonymous flex items wrapping the text nodes around the `<span>`. Set `gap: 0` on the h2 and gave `.plan-count-badge` an explicit `margin-left` to preserve its previous spacing. Verified: `Workouts(41)` renders without internal padding.
95. **Log Workout (material.css) — variable reps dropdown arrow obscured the digit**: When the user picked 5+ sets in Variable Reps mode, each per-set `<select class="variable-rep-select">` rendered with the universal Material `select` styling (20px arrow + 2.5rem padding-right) — there was no rule for `.variable-rep-select`, only for `.variable-rep-input` (which is the Time-mode number input) and `.variable-weight-select`. Added the rep-select to the same compact rule (40px height, 14px arrow, 1rem padding-right, max-width 60px) and to the focus-padding override. Digits like "6", "10" now visible in every per-set dropdown.
96. **Workout Records (all-workouts.html) — Whole Body / Cardio HIIT abbreviations**: `getCategoryShort` was missing entries for `'Whole Body'` and `'Cardio HIIT'`, so they fell through to literal text while sibling categories rendered as compact `UB`/`LB` tags. Added `'Whole Body': 'W'` and `'Cardio HIIT': 'C'` to the shorts map (matching the `getCategoryTags` map already in `index.html`). Verified: `getCategoryShort('Whole Body') === 'W'`, `'Cardio HIIT' → 'C'`, multi-category fallback `'Lower Body,Whole Body' → 'LB/W'`.

---

*Last updated: April 25, 2026*

## Performance work (April 25, 2026)

Diagnosed and fixed the lag perceived when switching to the Log Workout tab after editing an exercise in the Library:

| Metric | Before | After |
|---|---|---|
| `GET /api/exercises` payload | multi-MB (base64 images) | **24 KB** |
| `GET /api/exercises` TTFB | (slow on mobile) | **99 ms** |
| Stations queries per plan-list call | 1 per plan (N+1) | 1 batched |
| `getExercises` D1 query | LEFT JOIN aggregation, 4.2 ms avg, 271 rows read | indexed lookup, no aggregation |

Migration: [`migrations/0008_denormalize_workout_count.sql`](migrations/0008_denormalize_workout_count.sql).

Production backups (gitignored): `backups/prod-backup-pre-0008-*.sql` and `backups/prod-backup-post-0008-*.sql`.
