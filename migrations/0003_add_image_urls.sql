-- Migration: Add image URLs to exercises
-- Image naming convention: lowercase, hyphens instead of spaces, .jpg extension
-- Example: "BB Back squat" -> "bb-back-squat.jpg"

-- Barbell exercises
UPDATE exercises SET image_url = '/images/exercises/bb-back-squat.jpg' WHERE name = 'BB Back squat';
UPDATE exercises SET image_url = '/images/exercises/bb-bent-over-row.jpg' WHERE name = 'BB Bent over row';
UPDATE exercises SET image_url = '/images/exercises/bb-bicep-curl.jpg' WHERE name = 'BB Bicep curl';
UPDATE exercises SET image_url = '/images/exercises/bb-deadlift.jpg' WHERE name = 'BB Deadlift';
UPDATE exercises SET image_url = '/images/exercises/bb-front-squat.jpg' WHERE name = 'BB Front squat';
UPDATE exercises SET image_url = '/images/exercises/bb-good-morning.jpg' WHERE name = 'BB Good morning';
UPDATE exercises SET image_url = '/images/exercises/bb-hip-thrust.jpg' WHERE name = 'BB Hip thrust';
UPDATE exercises SET image_url = '/images/exercises/bb-incline-bench-press.jpg' WHERE name = 'BB Incline bench press';
UPDATE exercises SET image_url = '/images/exercises/bb-lying-tricep-extension.jpg' WHERE name = 'BB Lying tricep extension';
UPDATE exercises SET image_url = '/images/exercises/bb-overhead-press.jpg' WHERE name = 'BB Overhead press';
UPDATE exercises SET image_url = '/images/exercises/bb-preacher-curl.jpg' WHERE name = 'BB Preacher curl';
UPDATE exercises SET image_url = '/images/exercises/bb-romanian-deadlift.jpg' WHERE name = 'BB Romanian deadlift';
UPDATE exercises SET image_url = '/images/exercises/bb-shoulder-shrug.jpg' WHERE name = 'BB Shoulder shrug';
UPDATE exercises SET image_url = '/images/exercises/bb-split-squat.jpg' WHERE name = 'BB Split squat';
UPDATE exercises SET image_url = '/images/exercises/bb-sumo-deadlift.jpg' WHERE name = 'BB Sumo deadlift';
UPDATE exercises SET image_url = '/images/exercises/bb-upright-row.jpg' WHERE name = 'BB Upright row';
UPDATE exercises SET image_url = '/images/exercises/bench-press.jpg' WHERE name = 'Bench press';

-- Cable exercises
UPDATE exercises SET image_url = '/images/exercises/cable-bicep-curl.jpg' WHERE name = 'Cable Bicep curl';
UPDATE exercises SET image_url = '/images/exercises/cable-chest-fly.jpg' WHERE name = 'Cable Chest fly';
UPDATE exercises SET image_url = '/images/exercises/cable-face-pull.jpg' WHERE name = 'Cable Face pull';
UPDATE exercises SET image_url = '/images/exercises/cable-lat-pulldown.jpg' WHERE name = 'Cable Lat pulldown';
UPDATE exercises SET image_url = '/images/exercises/cable-seated-row.jpg' WHERE name = 'Cable Seated row';
UPDATE exercises SET image_url = '/images/exercises/cable-tricep-pushdown.jpg' WHERE name = 'Cable Tricep pushdown';

-- Dumbbell exercises
UPDATE exercises SET image_url = '/images/exercises/db-bench-press.jpg' WHERE name = 'DB Bench press';
UPDATE exercises SET image_url = '/images/exercises/db-bicep-curl.jpg' WHERE name = 'DB Bicep curl';
UPDATE exercises SET image_url = '/images/exercises/db-chest-fly.jpg' WHERE name = 'DB Chest fly';
UPDATE exercises SET image_url = '/images/exercises/db-front-raise.jpg' WHERE name = 'DB Front raise';
UPDATE exercises SET image_url = '/images/exercises/db-goblet-squat.jpg' WHERE name = 'DB Goblet squat';
UPDATE exercises SET image_url = '/images/exercises/db-hammer-curl.jpg' WHERE name = 'DB Hammer curl';
UPDATE exercises SET image_url = '/images/exercises/db-incline-bench-press.jpg' WHERE name = 'DB Incline bench press';
UPDATE exercises SET image_url = '/images/exercises/db-incline-curl.jpg' WHERE name = 'DB Incline curl';
UPDATE exercises SET image_url = '/images/exercises/db-lateral-raise.jpg' WHERE name = 'DB Lateral raise';
UPDATE exercises SET image_url = '/images/exercises/db-lunge.jpg' WHERE name = 'DB Lunge';
UPDATE exercises SET image_url = '/images/exercises/db-overhead-press.jpg' WHERE name = 'DB Overhead press';
UPDATE exercises SET image_url = '/images/exercises/db-preacher-curl.jpg' WHERE name = 'DB Preacher curl';
UPDATE exercises SET image_url = '/images/exercises/db-rear-delt-fly.jpg' WHERE name = 'DB Rear delt fly';
UPDATE exercises SET image_url = '/images/exercises/db-romanian-deadlift.jpg' WHERE name = 'DB Romanian deadlift';
UPDATE exercises SET image_url = '/images/exercises/db-row.jpg' WHERE name = 'DB Row';
UPDATE exercises SET image_url = '/images/exercises/db-shoulder-shrug.jpg' WHERE name = 'DB Shoulder shrug';
UPDATE exercises SET image_url = '/images/exercises/db-skull-crusher.jpg' WHERE name = 'DB Skull crusher';
UPDATE exercises SET image_url = '/images/exercises/db-split-squat.jpg' WHERE name = 'DB Split squat';
UPDATE exercises SET image_url = '/images/exercises/db-step-up.jpg' WHERE name = 'DB Step up';
UPDATE exercises SET image_url = '/images/exercises/db-tricep-kickback.jpg' WHERE name = 'DB Tricep kickback';

-- EZ Bar exercises
UPDATE exercises SET image_url = '/images/exercises/ez-bar-bicep-curl.jpg' WHERE name = 'EZ Bar Bicep curl';
UPDATE exercises SET image_url = '/images/exercises/ez-bar-preacher-curl.jpg' WHERE name = 'EZ Bar Preacher curl';
UPDATE exercises SET image_url = '/images/exercises/ez-bar-skull-crusher.jpg' WHERE name = 'EZ Bar Skull crusher';

-- Kettlebell exercises
UPDATE exercises SET image_url = '/images/exercises/kb-goblet-squat.jpg' WHERE name = 'KB Goblet squat';
UPDATE exercises SET image_url = '/images/exercises/kb-swing.jpg' WHERE name = 'KB Swing';
UPDATE exercises SET image_url = '/images/exercises/kb-turkish-get-up.jpg' WHERE name = 'KB Turkish get-up';

-- Machine exercises
UPDATE exercises SET image_url = '/images/exercises/machine-cable-crossover.jpg' WHERE name = 'Machine Cable crossover';
UPDATE exercises SET image_url = '/images/exercises/machine-calf-raise.jpg' WHERE name = 'Machine Calf raise';
UPDATE exercises SET image_url = '/images/exercises/machine-chest-press.jpg' WHERE name = 'Machine Chest press';
UPDATE exercises SET image_url = '/images/exercises/machine-hack-squat.jpg' WHERE name = 'Machine Hack squat';
UPDATE exercises SET image_url = '/images/exercises/machine-lat-pulldown.jpg' WHERE name = 'Machine Lat pulldown';
UPDATE exercises SET image_url = '/images/exercises/machine-leg-curl.jpg' WHERE name = 'Machine Leg curl';
UPDATE exercises SET image_url = '/images/exercises/machine-leg-extension.jpg' WHERE name = 'Machine Leg extension';
UPDATE exercises SET image_url = '/images/exercises/machine-leg-press.jpg' WHERE name = 'Machine Leg press';
UPDATE exercises SET image_url = '/images/exercises/machine-pec-fly.jpg' WHERE name = 'Machine Pec fly';
UPDATE exercises SET image_url = '/images/exercises/machine-seated-row.jpg' WHERE name = 'Machine Seated row';
UPDATE exercises SET image_url = '/images/exercises/machine-shoulder-press.jpg' WHERE name = 'Machine Shoulder press';
