-- Rastrea el plan "maestro" del que se clonó, para acumular valoraciones correctamente
ALTER TABLE planes.plan_estudio
    ADD COLUMN IF NOT EXISTS original_plan_id UUID REFERENCES planes.plan_estudio(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_plan_original ON planes.plan_estudio(original_plan_id);
