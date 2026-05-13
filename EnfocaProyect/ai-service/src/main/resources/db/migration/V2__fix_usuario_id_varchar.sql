-- El campo usuario_id se almacena como String (id del JWT), no como UUID
ALTER TABLE planes.plan_estudio
    ALTER COLUMN usuario_id TYPE VARCHAR(50) USING usuario_id::text;

ALTER TABLE planes.validacion
    ALTER COLUMN usuario_id TYPE VARCHAR(50) USING usuario_id::text;
