-- Migration: Add branch column to workout_plans
-- This allows users to specify workout branches (e.g., "A", "B", "Upper", "Lower")

ALTER TABLE workout_plans ADD COLUMN branch TEXT;
