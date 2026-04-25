// Workout plan API routes
import { Hono } from 'hono';
import type { Env } from '../types';
import {
  getWorkoutPlan,
  getRecentWorkoutPlans,
  saveWorkoutPlan,
  deleteWorkoutPlan,
  getWorkoutPlanStations,
  getStationsForPlans,
  saveWorkoutPlanStations,
  getBranchHistory,
  updateWorkoutPlanBranch,
} from '../db';

const plans = new Hono<{ Bindings: Env }>();

// GET /api/plans - Get recent workout plans
plans.get('/', async (c) => {
  const limit = c.req.query('limit');
  const plansList = await getRecentWorkoutPlans(c.env.DB, limit ? parseInt(limit) : 10);

  const stationsByPlan = await getStationsForPlans(c.env.DB, plansList.map((p) => p.id));
  const plansWithStations = plansList.map((plan) => ({
    ...plan,
    stations: stationsByPlan.get(plan.id) ?? [],
  }));

  return c.json({ plans: plansWithStations });
});

// GET /api/plans/branch-history - Get branch visit history
plans.get('/branch-history', async (c) => {
  const history = await getBranchHistory(c.env.DB);

  // Group by branch
  const grouped: Record<string, { plan_date: string; theme: string }[]> = {};
  for (const row of history) {
    if (!grouped[row.branch]) grouped[row.branch] = [];
    grouped[row.branch].push({ plan_date: row.plan_date, theme: row.theme });
  }

  return c.json({ branches: grouped });
});

// GET /api/plans/:date - Get workout plan for specific date
plans.get('/:date', async (c) => {
  const planDate = c.req.param('date');

  const plan = await getWorkoutPlan(c.env.DB, planDate);
  if (!plan) {
    return c.json({ plan: null, stations: [] });
  }

  const stations = await getWorkoutPlanStations(c.env.DB, plan.id);
  return c.json({ plan, stations });
});

// POST /api/plans - Create or update workout plan with stations
plans.post('/', async (c) => {
  try {
    const data = await c.req.json();

    const planId = await saveWorkoutPlan(c.env.DB, {
      plan_date: data.plan_date,
      theme: data.theme,
      workout_type: data.workout_type,
      branch: data.branch,
      description: data.description,
      no_show: data.no_show,
    });

    // Save stations
    const stationsData = (data.stations || []).filter(
      (s: { exercise_name?: string }) => s.exercise_name?.trim()
    );
    await saveWorkoutPlanStations(c.env.DB, planId, stationsData);

    return c.json({
      id: planId,
      success: true,
      stations_count: stationsData.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

// PATCH /api/plans/:date - Update branch field only (does not touch stations)
plans.patch('/:date', async (c) => {
  const planDate = c.req.param('date');
  try {
    const data = await c.req.json();
    const success = await updateWorkoutPlanBranch(c.env.DB, planDate, data.branch ?? null);
    if (!success) {
      return c.json({ error: 'Plan not found' }, 404);
    }
    return c.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 400);
  }
});

// DELETE /api/plans/:date - Delete workout plan
plans.delete('/:date', async (c) => {
  const planDate = c.req.param('date');

  const success = await deleteWorkoutPlan(c.env.DB, planDate);
  if (!success) {
    return c.json({ error: 'Plan not found' }, 404);
  }

  return c.json({ success: true });
});

export default plans;
