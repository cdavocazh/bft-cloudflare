// Workout log API routes
import { Hono } from 'hono';
import type { Env } from '../types';
import {
  getWorkoutHistory,
  getWorkoutLogById,
  createWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getExerciseProgression,
  getAllWorkoutLogsForExport,
} from '../db';

const workouts = new Hono<{ Bindings: Env }>();

// GET /api/workouts - Get workout history
workouts.get('/', async (c) => {
  const exercise_id = c.req.query('exercise_id');
  const category = c.req.query('category');
  const workout_date = c.req.query('workout_date');
  const limit = c.req.query('limit');

  const result = await getWorkoutHistory(c.env.DB, {
    exercise_id: exercise_id ? parseInt(exercise_id) : undefined,
    category,
    workout_date,
    limit: limit ? parseInt(limit) : 100,
  });

  return c.json({ workouts: result });
});

// GET /api/workouts/export - Export all workouts
workouts.get('/export', async (c) => {
  const data = await getAllWorkoutLogsForExport(c.env.DB);
  return c.json({ workouts: data });
});

// GET /api/workouts/progression/:exerciseId - Get progression for exercise
workouts.get('/progression/:exerciseId', async (c) => {
  const exerciseId = parseInt(c.req.param('exerciseId'));
  if (isNaN(exerciseId)) {
    return c.json({ error: 'Invalid exercise ID' }, 400);
  }

  const progression = await getExerciseProgression(c.env.DB, exerciseId);
  return c.json({ progression });
});

// POST /api/workouts - Create workout log
workouts.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const id = await createWorkoutLog(c.env.DB, data);
    return c.json({ id, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

// GET /api/workouts/:id - Get single workout
workouts.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid workout ID' }, 400);
  }

  const workout = await getWorkoutLogById(c.env.DB, id);
  if (!workout) {
    return c.json({ error: 'Workout not found' }, 404);
  }

  return c.json(workout);
});

// PUT /api/workouts/:id - Update workout log
workouts.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid workout ID' }, 400);
  }

  const data = await c.req.json();
  const success = await updateWorkoutLog(c.env.DB, id, data);

  if (!success) {
    return c.json({ error: 'Workout not found or update failed' }, 404);
  }

  return c.json({ success: true });
});

// DELETE /api/workouts/:id - Delete workout log
workouts.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid workout ID' }, 400);
  }

  const success = await deleteWorkoutLog(c.env.DB, id);
  if (!success) {
    return c.json({ error: 'Workout not found' }, 404);
  }

  return c.json({ success: true });
});

export default workouts;
