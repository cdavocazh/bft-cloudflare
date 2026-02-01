-- BFT Workout Tracker - Seed Data
-- Migration: 0002_seed.sql

-- Seed exercises (60+ exercises from BFT Notes)
INSERT OR IGNORE INTO exercises (name, category, subcategory, equipment_type, muscle_main, muscle_additional) VALUES
-- Upper Body - Chest
('BB bench press', 'Upper Body', 'Chest', 'BB', 'Chest', 'Triceps,Shoulders'),
('DB Bench press', 'Upper Body', 'Chest', 'DB', 'Chest', 'Triceps,Shoulders'),
('DB floor press', 'Upper Body', 'Chest', 'DB', 'Chest', 'Triceps'),
('KB floor press', 'Upper Body', 'Chest', 'KB', 'Chest', 'Triceps'),
('DB chest fly', 'Upper Body', 'Chest', 'DB', 'Chest', 'Shoulders'),

-- Upper Body - Shoulder
('DB shoulder press', 'Upper Body', 'Shoulder', 'DB', 'Shoulders', 'Triceps'),
('DB OH press', 'Upper Body', 'Shoulder', 'DB', 'Shoulders', 'Triceps'),
('Incline BB bench press', 'Upper Body', 'Shoulder', 'BB', 'Chest', 'Shoulders,Triceps'),
('Shoulder press seated', 'Upper Body', 'Shoulder', 'DB', 'Shoulders', 'Triceps'),
('Shoulder press standing', 'Upper Body', 'Shoulder', 'DB', 'Shoulders', 'Triceps,Core'),

-- Upper Body - Isolation
('DB Overhead tricep extension', 'Upper Body', 'Isolation', 'DB', 'Triceps', NULL),
('DB Overhead two arm tricep extension', 'Upper Body', 'Isolation', 'DB', 'Triceps', NULL),

-- Upper Body - KBs
('KB Gorilla row', 'Upper Body', 'KBs', 'KB', 'Back', 'Biceps,Core'),
('KB overhead press', 'Upper Body', 'KBs', 'KB', 'Shoulders', 'Triceps,Core'),
('KB Arnold press', 'Upper Body', 'KBs', 'KB', 'Shoulders', 'Triceps'),
('KB Upright Row', 'Upper Body', 'KBs', 'KB', 'Shoulders', 'Traps'),
('KB seated strict press', 'Upper Body', 'KBs', 'KB', 'Shoulders', 'Triceps'),
('Renegade KB row', 'Upper Body', 'KBs', 'KB', 'Back', 'Core,Biceps'),

-- Upper Body - Back
('DB Bent Over Row', 'Upper Body', 'Back', 'DB', 'Back', 'Biceps'),
('DB Lat Pullover', 'Upper Body', 'Back', 'DB', 'Lats', 'Chest,Triceps'),
('DB incline bench row', 'Upper Body', 'Back', 'DB', 'Back', 'Biceps'),
('DB lateral fly', 'Upper Body', 'Back', 'DB', 'Shoulders', 'Traps'),
('BB bent-over row', 'Upper Body', 'Back', 'BB', 'Back', 'Biceps,Core'),
('Pendlay row', 'Upper Body', 'Back', 'BB', 'Back', 'Biceps'),

-- Upper Body - BB
('BB military press', 'Upper Body', 'BB', 'BB', 'Shoulders', 'Triceps,Core'),

-- Lower Body - Squats
('BB Deep squat', 'Lower Body', 'Squats', 'BB', 'Quads', 'Glutes,Core'),
('BB Back squat', 'Lower Body', 'Squats', 'BB', 'Quads', 'Glutes,Hamstrings'),
('BB Front DSquat', 'Lower Body', 'Squats', 'BB', 'Quads', 'Glutes,Core'),
('BB squat single leg', 'Lower Body', 'Squats', 'BB', 'Quads', 'Glutes,Core'),

-- Lower Body - Deadlifts
('BB Deadlift', 'Lower Body', 'Deadlifts', 'BB', 'Hamstrings', 'Glutes,Back'),
('BB Sumo Deadlift', 'Lower Body', 'Deadlifts', 'BB', 'Glutes', 'Hamstrings,Quads'),
('Deadlift (trap bar)', 'Lower Body', 'Deadlifts', 'Trap Bar', 'Quads', 'Hamstrings,Glutes'),
('Single-Leg RDL', 'Lower Body', 'Deadlifts', 'DB', 'Hamstrings', 'Glutes,Core'),

-- Lower Body - KB
('KB deadlift', 'Lower Body', 'KB', 'KB', 'Hamstrings', 'Glutes,Back'),
('KB Deep Squat front-racked', 'Lower Body', 'KB', 'KB', 'Quads', 'Glutes,Core'),
('KB Suitcase Deadlift', 'Lower Body', 'KB', 'KB', 'Hamstrings', 'Core,Forearms'),
('KB sumo squat', 'Lower Body', 'KB', 'KB', 'Glutes', 'Quads'),

-- Lower Body - RDL
('BB RDL', 'Lower Body', 'RDL', 'BB', 'Hamstrings', 'Glutes,Back'),
('Dumbbell RDL', 'Lower Body', 'RDL', 'DB', 'Hamstrings', 'Glutes'),
('KB RDL', 'Lower Body', 'RDL', 'KB', 'Hamstrings', 'Glutes'),

-- Lower Body - Hip extension
('Hip extension floor', 'Lower Body', 'Hip extension', 'Bodyweight', 'Glutes', 'Hamstrings'),
('Hip extension bench', 'Lower Body', 'Hip extension', 'Bodyweight', 'Glutes', 'Hamstrings'),
('Hip extension bench single-leg', 'Lower Body', 'Hip extension', 'Bodyweight', 'Glutes', 'Hamstrings,Core'),

-- Lower Body - DB
('DB Goblin Squat', 'Lower Body', 'DB', 'DB', 'Quads', 'Glutes,Core'),
('DB front squat', 'Lower Body', 'DB', 'DB', 'Quads', 'Glutes,Core'),
('DB alternate side squat', 'Lower Body', 'DB', 'DB', 'Quads', 'Glutes'),
('Stool single leg DB step up', 'Lower Body', 'DB', 'DB', 'Quads', 'Glutes'),

-- Lower Body - Other
('Sprinter squat', 'Lower Body', 'Other', 'KB', 'Quads', 'Glutes,Core'),
('Backward lunge from stool', 'Lower Body', 'Other', 'DB', 'Quads', 'Glutes,Hamstrings'),
('Farmer carry', 'Lower Body', 'Other', 'KB', 'Core', 'Forearms,Traps'),
('Farmer carry front-racked', 'Lower Body', 'Other', 'KB', 'Core', 'Shoulders,Forearms'),

-- Cardio HIIT
('Rope', 'Cardio HIIT', 'Cardio', 'Machine', 'Full Body', NULL),
('Small bike', 'Cardio HIIT', 'Cardio', 'Machine', 'Quads', 'Hamstrings'),
('Big bike (Bionic Bike)', 'Cardio HIIT', 'Cardio', 'Machine', 'Full Body', NULL),
('Row erg', 'Cardio HIIT', 'Cardio', 'Machine', 'Back', 'Quads,Core'),
('Ski erg', 'Cardio HIIT', 'Cardio', 'Machine', 'Lats', 'Core,Triceps'),

-- Whole Body (Core+, Power)
('KB squat swing', 'Whole Body', 'Power', 'KB', 'Glutes', 'Hamstrings,Core'),
('KB Bent-over Row', 'Whole Body', 'Power', 'KB', 'Back', 'Biceps,Core'),
('KB snatch', 'Whole Body', 'Power', 'KB', 'Shoulders', 'Glutes,Core'),
('BB hang clean', 'Whole Body', 'Power', 'BB', 'Traps', 'Glutes,Quads'),
('BB good mornings', 'Whole Body', 'Core+', 'BB', 'Hamstrings', 'Glutes,Back'),
('BB standing push press', 'Whole Body', 'Power', 'BB', 'Shoulders', 'Triceps,Quads');
