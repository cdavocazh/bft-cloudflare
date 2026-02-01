# Claude Code Instructions for BFT Workout Tracker

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
│   │   └── style.css         # All styles (mobile-first, single file)
│   └── js/
│       ├── api.js            # API client for backend calls
│       └── utils.js          # Utility functions (formatDate, showToast, etc.)
├── src/
│   └── index.ts              # Cloudflare Worker backend (Hono)
├── schema.sql                # D1 database schema
├── wrangler.toml             # Cloudflare configuration
├── status.md                 # Requirements tracking (MUST UPDATE)
└── claude.md                 # This file
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

### 1. Always Update status.md
After making ANY feature changes, you MUST update `status.md`:
- Add new features to the appropriate page's table
- Mark completed features with ✅ Done
- Add entry to "Recent Changes (This Session)" section at the bottom
- Update the "Last updated" date

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
- [ ] status.md is updated with all changes
- [ ] No console errors in browser
- [ ] Mobile layout is not broken
