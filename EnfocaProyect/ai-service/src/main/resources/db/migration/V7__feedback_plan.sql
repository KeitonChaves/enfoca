CREATE TABLE IF NOT EXISTS planes.feedback_plan (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_maestro_id UUID        NOT NULL REFERENCES planes.plan_estudio(id) ON DELETE CASCADE,
    usuario_id      VARCHAR(50) NOT NULL,
    motivo          VARCHAR(30) NOT NULL,
    detalle         TEXT,
    creado_en       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (plan_maestro_id, usuario_id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_maestro ON planes.feedback_plan(plan_maestro_id);
CREATE INDEX IF NOT EXISTS idx_feedback_motivo  ON planes.feedback_plan(plan_maestro_id, motivo);
