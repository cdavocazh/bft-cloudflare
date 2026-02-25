// Type definitions for BFT Workout Tracker

export interface Env {
  DB: D1Database;
  ENVIRONMENT: string;
}

// Database row types
export interface Exercise {
  id: number;
  name: string;
  category: string;
  categories: string | null;
  subcategory: string | null;
  equipment_type: string | null;
  muscle_main: string | null;
  muscle_additional: string | null;
  image_url: string | null;
  weight_min: number | null;
  weight_max: number | null;
  weight_increment: number | null;
  reps_min: number | null;
  reps_max: number | null;
  measure_type: string | null;
  created_at: string;
  workout_count?: number;
}

export interface WorkoutLog {
  id: number;
  exercise_id: number;
  weight_kg: number;
  reps: number;
  sets: number;
  workout_date: string;
  notes: string | null;
  tags: string | null;
  created_at: string;
  // Joined fields
  exercise_name?: string;
  category?: string;
  subcategory?: string;
  equipment_type?: string;
  image_url?: string;
}

export interface WorkoutPlan {
  id: number;
  plan_date: string;
  theme: string;
  workout_type: string | null;
  branch: string | null;
  description: string | null;
  no_show: number | null;
  created_at: string;
  stations?: WorkoutPlanStation[];
}

export interface WorkoutPlanStation {
  id: number;
  plan_id: number;
  station_number: number;
  exercise_name: string;
  set_arrangement: string | null;
  station_time: string | null;
  notes: string | null;
  created_at: string;
}

// API request types
export interface CreateWorkoutLogRequest {
  exercise_id?: number;
  exercise_name?: string;
  category?: string;
  weight_kg: number;
  reps: number;
  sets: number;
  workout_date: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateWorkoutLogRequest {
  weight_kg?: number;
  reps?: number;
  sets?: number;
  workout_date?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateExerciseRequest {
  exercise_name: string;
  category: string;
  categories?: string[];
  subcategory?: string;
  equipment_type?: string;
  muscle_main?: string;
  muscle_additional?: string;
  weight_min?: number;
  weight_max?: number;
  weight_increment?: number;
  reps_min?: number;
  reps_max?: number;
  measure_type?: string;
}

export interface UpdateExerciseRequest {
  name?: string;
  category?: string;
  categories?: string[];
  subcategory?: string;
  equipment_type?: string;
  muscle_main?: string;
  muscle_additional?: string;
  image_url?: string | null;
  weight_min?: number;
  weight_max?: number;
  weight_increment?: number;
  reps_min?: number;
  reps_max?: number;
  measure_type?: string;
}

export interface CreateWorkoutPlanRequest {
  plan_date: string;
  theme: string;
  workout_type?: string;
  branch?: string;
  description?: string;
  no_show?: boolean;
  stations: {
    station_number: number;
    exercise_name: string;
    set_arrangement?: string;
    station_time?: string;
    notes?: string;
  }[];
}

// Constants
export const WORKOUT_CATEGORIES = ['Upper Body', 'Lower Body', 'Cardio HIIT', 'Whole Body'] as const;

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core',
  'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Forearms', 'Traps', 'Lats', 'Full Body'
] as const;

export const EQUIPMENT_TYPES = ['BB', 'DB', 'KB', 'Machine', 'Bodyweight', 'Trap Bar'] as const;

export const WORKOUT_TAGS = ['with cadence'] as const;

export const WEIGHT_METHODS = ['ES', 'One', 'Total'] as const;

export const PRESET_SETS = {
  'Custom (same rep per set)': null,
  'Custom (variable reps)': { variable: true },
  '8/8/8 (3 sets of 8 reps)': { sets: 3, reps: 8 },
  '8/8/8/8 (4 sets of 8 reps)': { sets: 4, reps: 8 },
  '6/6/6/6 (4 sets of 6 reps)': { sets: 4, reps: 6 },
} as const;

export const WORKOUT_THEMES = [
  'Strength (LB)', 'Strength (UB)', 'Pump (UB)', 'Pump (LB)',
  'Power', 'Strength Endurance', 'Strength (Mixed)', 'Hyper'
] as const;

export const WORKOUT_TYPES_PLAN = ['Single sets', 'Superset', 'Custom'] as const;

// Weight increments for different equipment types (min/max come from exercise)
export const WEIGHT_INCREMENTS: Record<string, number> = {
  BB: 2.5,
  DB: 2,
  KB: 4,
  Machine: 5,
  Bodyweight: 0,
  'Trap Bar': 5,
  default: 2.5,
};
