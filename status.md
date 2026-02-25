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

---

*Last updated: February 25, 2026*
