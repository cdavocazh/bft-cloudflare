// Exercise API routes
import { Hono } from 'hono';
import type { Env } from '../types';
import {
  getExercises,
  getExerciseById,
  searchExercises,
  createExercise,
  updateExercise,
  deleteExercise,
  getLatestWorkoutForExercise,
  getUniqueMuscles,
} from '../db';

const exercises = new Hono<{ Bindings: Env }>();

// GET /api/exercises - List exercises with filters
exercises.get('/', async (c) => {
  const category = c.req.query('category');
  const muscle_main = c.req.query('muscle_main');
  const muscle_additional = c.req.query('muscle_additional');
  const equipment_type = c.req.query('equipment_type');

  const result = await getExercises(c.env.DB, {
    category,
    muscle_main,
    muscle_additional,
    equipment_type,
  });

  return c.json({ exercises: result });
});

// GET /api/exercises/search - Search exercises
exercises.get('/search', async (c) => {
  const q = c.req.query('q');
  if (!q || q.length < 1) {
    return c.json({ error: 'Query parameter "q" is required' }, 400);
  }

  const result = await searchExercises(c.env.DB, q);
  return c.json({ exercises: result });
});

// GET /api/exercises/muscles - Get unique muscles in library
exercises.get('/muscles', async (c) => {
  const muscles = await getUniqueMuscles(c.env.DB);
  return c.json(muscles);
});

// POST /api/exercises - Create exercise
exercises.post('/', async (c) => {
  try {
    const data = await c.req.json();
    const id = await createExercise(c.env.DB, data);
    return c.json({ id, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

// GET /api/exercises/:id - Get single exercise
exercises.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid exercise ID' }, 400);
  }

  const exercise = await getExerciseById(c.env.DB, id);
  if (!exercise) {
    return c.json({ error: 'Exercise not found' }, 404);
  }

  return c.json(exercise);
});

// PUT /api/exercises/:id - Update exercise
exercises.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid exercise ID' }, 400);
  }

  const data = await c.req.json();
  const success = await updateExercise(c.env.DB, id, data);

  if (!success) {
    return c.json({ error: 'Exercise not found or update failed' }, 404);
  }

  return c.json({ success: true });
});

// DELETE /api/exercises/:id - Delete exercise
exercises.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid exercise ID' }, 400);
  }

  const result = await deleteExercise(c.env.DB, id);
  if (!result.success) {
    const status = result.error?.includes('Cannot delete') ? 400 : 404;
    return c.json({ error: result.error || 'Exercise not found' }, status);
  }

  return c.json({ success: true });
});

// GET /api/exercises/:id/latest - Get latest workout for exercise
exercises.get('/:id/latest', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: 'Invalid exercise ID' }, 400);
  }

  const latest = await getLatestWorkoutForExercise(c.env.DB, id);
  return c.json({ latest });
});

export default exercises;
