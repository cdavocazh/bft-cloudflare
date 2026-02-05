// Database operations for BFT Workout Tracker
import type {
  Exercise,
  WorkoutLog,
  WorkoutPlan,
  WorkoutPlanStation,
  CreateWorkoutLogRequest,
  UpdateWorkoutLogRequest,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  CreateWorkoutPlanRequest,
} from './types';

// ==================== Exercise Functions ====================

export async function getExercises(
  db: D1Database,
  filters: {
    category?: string;
    muscle_main?: string;
    muscle_additional?: string;
    equipment_type?: string;
  } = {}
): Promise<Exercise[]> {
  let query = `
    SELECT e.*,
           COALESCE(log_counts.workout_count, 0) as workout_count,
           CASE e.equipment_type
               WHEN 'BB' THEN 1
               WHEN 'KB' THEN 2
               WHEN 'DB' THEN 3
               ELSE 4
           END as eq_order
    FROM exercises e
    LEFT JOIN (
        SELECT exercise_id, COUNT(*) as workout_count
        FROM workout_logs
        GROUP BY exercise_id
    ) log_counts ON e.id = log_counts.exercise_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters.category) {
    query += ` AND (e.category = ? OR e.categories LIKE ?)`;
    params.push(filters.category, `%${filters.category}%`);
  }
  if (filters.muscle_main) {
    query += ` AND e.muscle_main = ?`;
    params.push(filters.muscle_main);
  }
  if (filters.muscle_additional) {
    query += ` AND e.muscle_additional LIKE ?`;
    params.push(`%${filters.muscle_additional}%`);
  }
  if (filters.equipment_type) {
    query += ` AND e.equipment_type = ?`;
    params.push(filters.equipment_type);
  }

  query += ` ORDER BY workout_count DESC, eq_order ASC, e.name ASC`;

  const result = await db.prepare(query).bind(...params).all<Exercise>();
  return result.results;
}

export async function getExerciseById(db: D1Database, id: number): Promise<Exercise | null> {
  const result = await db.prepare('SELECT * FROM exercises WHERE id = ?').bind(id).first<Exercise>();
  return result;
}

export async function getExerciseByName(db: D1Database, name: string): Promise<Exercise | null> {
  const result = await db.prepare('SELECT * FROM exercises WHERE name = ?').bind(name).first<Exercise>();
  return result;
}

export async function searchExercises(db: D1Database, query: string, limit = 20): Promise<Exercise[]> {
  const result = await db
    .prepare('SELECT * FROM exercises WHERE name LIKE ? ORDER BY name LIMIT ?')
    .bind(`%${query}%`, limit)
    .all<Exercise>();
  return result.results;
}

export async function createExercise(db: D1Database, data: CreateExerciseRequest): Promise<number> {
  const existing = await getExerciseByName(db, data.exercise_name);
  if (existing) {
    throw new Error(`Exercise '${data.exercise_name}' already exists`);
  }

  const categoryStr = data.categories?.join(',') || data.category;

  const result = await db
    .prepare(
      `INSERT INTO exercises (name, category, subcategory, equipment_type, muscle_main, muscle_additional, weight_min, weight_max, weight_increment, reps_min, reps_max)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      data.exercise_name,
      categoryStr,
      data.subcategory || null,
      data.equipment_type || null,
      data.muscle_main || null,
      data.muscle_additional || null,
      data.weight_min || null,
      data.weight_max || null,
      data.weight_increment || null,
      data.reps_min || null,
      data.reps_max || null
    )
    .run();

  return result.meta.last_row_id as number;
}

export async function updateExercise(db: D1Database, id: number, data: UpdateExerciseRequest): Promise<boolean> {
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    params.push(data.name);
  }
  if (data.category !== undefined) {
    updates.push('category = ?');
    params.push(data.category);
  }
  if (data.categories !== undefined) {
    updates.push('categories = ?');
    params.push(data.categories.join(',') || null);
  }
  if (data.subcategory !== undefined) {
    updates.push('subcategory = ?');
    params.push(data.subcategory || null);
  }
  if (data.equipment_type !== undefined) {
    updates.push('equipment_type = ?');
    params.push(data.equipment_type || null);
  }
  if (data.muscle_main !== undefined) {
    updates.push('muscle_main = ?');
    params.push(data.muscle_main || null);
  }
  if (data.muscle_additional !== undefined) {
    updates.push('muscle_additional = ?');
    params.push(data.muscle_additional || null);
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?');
    params.push(data.image_url);
  }
  if (data.weight_min !== undefined) {
    updates.push('weight_min = ?');
    params.push(data.weight_min && data.weight_min > 0 ? data.weight_min : null);
  }
  if (data.weight_max !== undefined) {
    updates.push('weight_max = ?');
    params.push(data.weight_max && data.weight_max > 0 ? data.weight_max : null);
  }
  if (data.weight_increment !== undefined) {
    updates.push('weight_increment = ?');
    params.push(data.weight_increment && data.weight_increment > 0 ? data.weight_increment : null);
  }
  if (data.reps_min !== undefined) {
    updates.push('reps_min = ?');
    params.push(data.reps_min && data.reps_min > 0 ? data.reps_min : null);
  }
  if (data.reps_max !== undefined) {
    updates.push('reps_max = ?');
    params.push(data.reps_max && data.reps_max > 0 ? data.reps_max : null);
  }

  if (updates.length === 0) return false;

  params.push(id);
  const result = await db
    .prepare(`UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run();

  return result.meta.changes > 0;
}

export async function deleteExercise(db: D1Database, id: number): Promise<{ success: boolean; error?: string }> {
  // Check if exercise has associated workout logs
  const logsResult = await db
    .prepare('SELECT COUNT(*) as count FROM workout_logs WHERE exercise_id = ?')
    .bind(id)
    .first<{ count: number }>();

  if (logsResult && logsResult.count > 0) {
    return {
      success: false,
      error: `Cannot delete: exercise has ${logsResult.count} workout log(s). Delete the logs first.`
    };
  }

  const result = await db.prepare('DELETE FROM exercises WHERE id = ?').bind(id).run();
  return { success: result.meta.changes > 0 };
}

export async function getOrCreateExercise(
  db: D1Database,
  name: string,
  category: string,
  subcategory?: string,
  equipment_type?: string
): Promise<number> {
  const existing = await getExerciseByName(db, name);
  if (existing) return existing.id;

  const result = await db
    .prepare('INSERT INTO exercises (name, category, subcategory, equipment_type) VALUES (?, ?, ?, ?)')
    .bind(name, category, subcategory || null, equipment_type || null)
    .run();

  return result.meta.last_row_id as number;
}

export async function getUniqueMuscles(db: D1Database): Promise<{ main: string[]; additional: string[] }> {
  const mainResult = await db
    .prepare('SELECT DISTINCT muscle_main FROM exercises WHERE muscle_main IS NOT NULL ORDER BY muscle_main')
    .all<{ muscle_main: string }>();

  const additionalResult = await db
    .prepare('SELECT DISTINCT muscle_additional FROM exercises WHERE muscle_additional IS NOT NULL')
    .all<{ muscle_additional: string }>();

  const additionalSet = new Set<string>();
  for (const row of additionalResult.results) {
    if (row.muscle_additional) {
      for (const muscle of row.muscle_additional.split(',')) {
        additionalSet.add(muscle.trim());
      }
    }
  }

  return {
    main: mainResult.results.map((r) => r.muscle_main),
    additional: Array.from(additionalSet).sort(),
  };
}

// ==================== Workout Log Functions ====================

export async function getWorkoutHistory(
  db: D1Database,
  filters: {
    exercise_id?: number;
    category?: string;
    workout_date?: string;
    limit?: number;
  } = {}
): Promise<WorkoutLog[]> {
  let query = `
    SELECT wl.id, wl.exercise_id, wl.weight_kg, wl.reps, wl.sets,
           wl.workout_date, wl.notes, wl.tags, wl.created_at,
           e.name as exercise_name, e.category, e.subcategory, e.equipment_type, e.image_url
    FROM workout_logs wl
    JOIN exercises e ON wl.exercise_id = e.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (filters.exercise_id) {
    query += ` AND wl.exercise_id = ?`;
    params.push(filters.exercise_id);
  }
  if (filters.category) {
    query += ` AND e.category = ?`;
    params.push(filters.category);
  }
  if (filters.workout_date) {
    query += ` AND wl.workout_date = ?`;
    params.push(filters.workout_date);
  }

  query += ` ORDER BY wl.workout_date DESC, wl.created_at DESC LIMIT ?`;
  params.push(filters.limit || 100);

  const result = await db.prepare(query).bind(...params).all<WorkoutLog>();
  return result.results;
}

export async function getWorkoutLogById(db: D1Database, id: number): Promise<WorkoutLog | null> {
  const result = await db
    .prepare(
      `SELECT wl.*, e.name as exercise_name, e.category, e.subcategory, e.equipment_type
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE wl.id = ?`
    )
    .bind(id)
    .first<WorkoutLog>();
  return result;
}

export async function createWorkoutLog(db: D1Database, data: CreateWorkoutLogRequest): Promise<number> {
  let exerciseId = data.exercise_id;

  if (!exerciseId && data.exercise_name) {
    exerciseId = await getOrCreateExercise(db, data.exercise_name, data.category || 'Upper Body');
  }

  if (!exerciseId) {
    throw new Error('Either exercise_id or exercise_name is required');
  }

  const tagsStr = data.tags?.join(',') || '';

  const result = await db
    .prepare(
      `INSERT INTO workout_logs (exercise_id, weight_kg, reps, sets, workout_date, notes, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(exerciseId, data.weight_kg, data.reps, data.sets, data.workout_date, data.notes || '', tagsStr)
    .run();

  return result.meta.last_row_id as number;
}

export async function updateWorkoutLog(db: D1Database, id: number, data: UpdateWorkoutLogRequest): Promise<boolean> {
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (data.weight_kg !== undefined) {
    updates.push('weight_kg = ?');
    params.push(data.weight_kg);
  }
  if (data.reps !== undefined) {
    updates.push('reps = ?');
    params.push(data.reps);
  }
  if (data.sets !== undefined) {
    updates.push('sets = ?');
    params.push(data.sets);
  }
  if (data.workout_date !== undefined) {
    updates.push('workout_date = ?');
    params.push(data.workout_date);
  }
  if (data.notes !== undefined) {
    updates.push('notes = ?');
    params.push(data.notes);
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    params.push(data.tags.join(',') || '');
  }

  if (updates.length === 0) return false;

  params.push(id);
  const result = await db
    .prepare(`UPDATE workout_logs SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...params)
    .run();

  return result.meta.changes > 0;
}

export async function deleteWorkoutLog(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare('DELETE FROM workout_logs WHERE id = ?').bind(id).run();
  return result.meta.changes > 0;
}

export async function getExerciseProgression(db: D1Database, exerciseId: number): Promise<WorkoutLog[]> {
  const result = await db
    .prepare(
      `SELECT id, workout_date, weight_kg, reps, sets,
              (weight_kg * reps * sets) as volume, notes
       FROM workout_logs
       WHERE exercise_id = ?
       ORDER BY workout_date ASC`
    )
    .bind(exerciseId)
    .all<WorkoutLog & { volume: number }>();
  return result.results;
}

export async function getLatestWorkoutForExercise(db: D1Database, exerciseId: number): Promise<WorkoutLog | null> {
  const result = await db
    .prepare(
      `SELECT wl.*, e.name as exercise_name
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE wl.exercise_id = ?
       ORDER BY wl.workout_date DESC, wl.created_at DESC
       LIMIT 1`
    )
    .bind(exerciseId)
    .first<WorkoutLog>();
  return result;
}

export async function getAllWorkoutLogsForExport(db: D1Database): Promise<WorkoutLog[]> {
  const result = await db
    .prepare(
      `SELECT wl.id, wl.workout_date, e.name as exercise_name, e.category,
              e.subcategory, e.equipment_type, wl.weight_kg, wl.reps, wl.sets,
              (wl.weight_kg * wl.reps * wl.sets) as volume, wl.notes, wl.tags,
              wl.created_at
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       ORDER BY wl.workout_date DESC, wl.created_at DESC`
    )
    .all<WorkoutLog & { volume: number }>();
  return result.results;
}

// ==================== Workout Plan Functions ====================

export async function getWorkoutPlan(db: D1Database, planDate: string): Promise<WorkoutPlan | null> {
  const result = await db
    .prepare('SELECT * FROM workout_plans WHERE plan_date = ?')
    .bind(planDate)
    .first<WorkoutPlan>();
  return result;
}

export async function getRecentWorkoutPlans(db: D1Database, limit = 10): Promise<WorkoutPlan[]> {
  const result = await db
    .prepare('SELECT * FROM workout_plans ORDER BY plan_date DESC LIMIT ?')
    .bind(limit)
    .all<WorkoutPlan>();
  return result.results;
}

export async function saveWorkoutPlan(
  db: D1Database,
  data: { plan_date: string; theme: string; workout_type?: string; branch?: string; description?: string; no_show?: boolean }
): Promise<number> {
  const existing = await getWorkoutPlan(db, data.plan_date);
  const noShowValue = data.no_show ? 1 : 0;

  if (existing) {
    await db
      .prepare('UPDATE workout_plans SET theme = ?, workout_type = ?, branch = ?, description = ?, no_show = ? WHERE plan_date = ?')
      .bind(data.theme, data.workout_type || null, data.branch || null, data.description || null, noShowValue, data.plan_date)
      .run();
    return existing.id;
  } else {
    const result = await db
      .prepare('INSERT INTO workout_plans (plan_date, theme, workout_type, branch, description, no_show) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(data.plan_date, data.theme, data.workout_type || null, data.branch || null, data.description || null, noShowValue)
      .run();
    return result.meta.last_row_id as number;
  }
}

export async function deleteWorkoutPlan(db: D1Database, planDate: string): Promise<boolean> {
  const result = await db.prepare('DELETE FROM workout_plans WHERE plan_date = ?').bind(planDate).run();
  return result.meta.changes > 0;
}

export async function getWorkoutPlanStations(db: D1Database, planId: number): Promise<WorkoutPlanStation[]> {
  const result = await db
    .prepare('SELECT * FROM workout_plan_stations WHERE plan_id = ? ORDER BY station_number')
    .bind(planId)
    .all<WorkoutPlanStation>();
  return result.results;
}

export async function saveWorkoutPlanStations(
  db: D1Database,
  planId: number,
  stations: CreateWorkoutPlanRequest['stations']
): Promise<boolean> {
  // Delete existing stations
  await db.prepare('DELETE FROM workout_plan_stations WHERE plan_id = ?').bind(planId).run();

  // Insert new stations
  for (const station of stations) {
    if (!station.exercise_name.trim()) continue;

    await db
      .prepare(
        `INSERT INTO workout_plan_stations (plan_id, station_number, exercise_name, set_arrangement, station_time, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        planId,
        station.station_number,
        station.exercise_name,
        station.set_arrangement || '',
        station.station_time || '',
        station.notes || ''
      )
      .run();
  }

  return true;
}

