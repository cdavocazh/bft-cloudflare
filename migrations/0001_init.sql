-- BFT Workout Tracker - D1 Database Schema
-- Migration: 0001_init.sql

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    categories TEXT,
    subcategory TEXT,
    equipment_type TEXT,
    muscle_main TEXT,
    muscle_additional TEXT,
    image_url TEXT,
    weight_min REAL,
    weight_max REAL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Workout logs table
CREATE TABLE IF NOT EXISTS workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    weight_kg REAL NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    workout_date TEXT NOT NULL,
    notes TEXT,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_date TEXT NOT NULL UNIQUE,
    theme TEXT NOT NULL,
    workout_type TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Workout plan stations table
CREATE TABLE IF NOT EXISTS workout_plan_stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    station_number INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    set_arrangement TEXT,
    station_time TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_date ON workout_logs(workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise ON workout_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
CREATE INDEX IF NOT EXISTS idx_workout_plans_date ON workout_plans(plan_date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_plan_stations_plan ON workout_plan_stations(plan_id);
