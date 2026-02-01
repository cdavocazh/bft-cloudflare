// BFT Workout Tracker - Cloudflare Workers Entry Point
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import {
  WORKOUT_CATEGORIES,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  WORKOUT_TAGS,
  WEIGHT_METHODS,
  PRESET_SETS,
  WORKOUT_THEMES,
  WORKOUT_TYPES_PLAN,
  WEIGHT_INCREMENTS,
} from './types';

// Import routes
import exercisesRoutes from './routes/exercises';
import workoutsRoutes from './routes/workouts';
import plansRoutes from './routes/plans';

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/api/*', cors());

// API routes
app.route('/api/exercises', exercisesRoutes);
app.route('/api/workouts', workoutsRoutes);
app.route('/api/plans', plansRoutes);

// GET /api/constants - Get all app constants
app.get('/api/constants', (c) => {
  return c.json({
    categories: WORKOUT_CATEGORIES,
    muscle_groups: MUSCLE_GROUPS,
    equipment_types: EQUIPMENT_TYPES,
    preset_sets: PRESET_SETS,
    workout_tags: WORKOUT_TAGS,
    workout_themes: WORKOUT_THEMES,
    workout_types: WORKOUT_TYPES_PLAN,
    weight_methods: WEIGHT_METHODS,
  });
});

// GET /api/weight-options/:equipmentType - Get weight increment for equipment
app.get('/api/weight-options/:equipmentType', (c) => {
  const equipmentType = c.req.param('equipmentType');
  const increment = WEIGHT_INCREMENTS[equipmentType] ?? WEIGHT_INCREMENTS.default;
  return c.json({ increment });
});

// POST /api/upload-image - Upload image as base64 and store in database
app.post('/api/upload-image', async (c) => {
  try {
    const body = await c.req.json();
    const { data, exercise_id } = body;

    if (!data || !exercise_id) {
      return c.json({ error: 'Missing data or exercise_id' }, 400);
    }

    // Data should be a base64 data URL (e.g., "data:image/jpeg;base64,...")
    // Validate it's a reasonable size (max 2MB for base64 which is ~1.5MB actual)
    if (data.length > 2 * 1024 * 1024) {
      return c.json({ error: 'Image too large. Max 1.5MB.' }, 400);
    }

    // Store the base64 data URL directly as image_url
    const result = await c.env.DB
      .prepare('UPDATE exercises SET image_url = ? WHERE id = ?')
      .bind(data, exercise_id)
      .run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'Exercise not found' }, 404);
    }

    return c.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

// GET /api/health - Health check
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    version: '2.0',
    platform: 'cloudflare-workers',
  });
});

// Static assets are served automatically by Wrangler v4 [assets] config
// The worker only handles /api/* routes; all other requests fall through to static assets

export default app;
