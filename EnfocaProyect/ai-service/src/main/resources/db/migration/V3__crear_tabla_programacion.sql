-- resources/db/migration/V3__crear_tabla_programacion.sql

CREATE TABLE IF NOT EXISTS planes.programacion (
                                                   id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id   UUID NOT NULL REFERENCES planes.tema(id) ON DELETE CASCADE,
    fecha     DATE NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Evitamos que un mismo tema se agende dos veces el mismo día
    UNIQUE (tema_id, fecha)
    );

CREATE INDEX IF NOT EXISTS idx_programacion_fecha ON planes.programacion(fecha);