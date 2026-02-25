-- Add measure_type column to exercises (Rep or Time)
ALTER TABLE exercises ADD COLUMN measure_type TEXT DEFAULT 'Rep';
