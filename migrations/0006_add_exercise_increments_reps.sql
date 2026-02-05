-- Add weight increment and reps range to exercises table
ALTER TABLE exercises ADD COLUMN weight_increment REAL;
ALTER TABLE exercises ADD COLUMN reps_min INTEGER;
ALTER TABLE exercises ADD COLUMN reps_max INTEGER;
