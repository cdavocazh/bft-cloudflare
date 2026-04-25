-- Denormalize workout_count onto exercises so GET /api/exercises does not
-- need a LEFT JOIN aggregation over workout_logs on every call.
-- Maintained by triggers on workout_logs (insert / delete / update of exercise_id).

ALTER TABLE exercises ADD COLUMN workout_count INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing workout_logs.
UPDATE exercises
SET workout_count = (
    SELECT COUNT(*)
    FROM workout_logs
    WHERE workout_logs.exercise_id = exercises.id
);

CREATE TRIGGER IF NOT EXISTS trg_workout_logs_after_insert
AFTER INSERT ON workout_logs
BEGIN
    UPDATE exercises
    SET workout_count = workout_count + 1
    WHERE id = NEW.exercise_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_workout_logs_after_delete
AFTER DELETE ON workout_logs
BEGIN
    UPDATE exercises
    SET workout_count = workout_count - 1
    WHERE id = OLD.exercise_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_workout_logs_after_update_exercise_id
AFTER UPDATE OF exercise_id ON workout_logs
WHEN OLD.exercise_id != NEW.exercise_id
BEGIN
    UPDATE exercises SET workout_count = workout_count - 1 WHERE id = OLD.exercise_id;
    UPDATE exercises SET workout_count = workout_count + 1 WHERE id = NEW.exercise_id;
END;
