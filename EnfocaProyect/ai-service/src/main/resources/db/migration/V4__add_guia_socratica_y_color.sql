-- Guía socrática por tema (JSON almacenado como texto)
ALTER TABLE planes.tema ADD COLUMN IF NOT EXISTS guia_socratica TEXT;

-- Color asignado a cada plan (hex, generado en creación)
ALTER TABLE planes.plan_estudio ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#8b5cf6';
