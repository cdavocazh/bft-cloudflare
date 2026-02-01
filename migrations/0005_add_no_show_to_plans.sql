-- Add no_show column to workout_plans table
ALTER TABLE workout_plans ADD COLUMN no_show INTEGER DEFAULT 0;
