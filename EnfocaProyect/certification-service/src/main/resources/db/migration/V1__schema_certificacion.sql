CREATE SCHEMA IF NOT EXISTS certificacion;

CREATE TABLE IF NOT EXISTS certificacion.pregunta_conocimiento (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_maestro_id   UUID         NOT NULL,
    modulo_titulo     VARCHAR(255) NOT NULL,
    tema_titulo       VARCHAR(255),
    texto             TEXT         NOT NULL,
    opciones          TEXT         NOT NULL,
    respuesta_correcta INTEGER     NOT NULL,
    explicacion       TEXT,
    veces_usada       INTEGER      NOT NULL DEFAULT 0,
    creada_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificacion.examen (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      VARCHAR(50)  NOT NULL,
    plan_maestro_id UUID         NOT NULL,
    plan_titulo     VARCHAR(255) NOT NULL,
    intento         INTEGER      NOT NULL DEFAULT 1,
    estado          VARCHAR(20)  NOT NULL DEFAULT 'EN_CURSO',
    puntaje         INTEGER      NOT NULL DEFAULT 0,
    creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finalizado_en   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificacion.pregunta_examen (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examen_id         UUID    NOT NULL REFERENCES certificacion.examen(id) ON DELETE CASCADE,
    pregunta_id       UUID    NOT NULL REFERENCES certificacion.pregunta_conocimiento(id),
    orden             INTEGER NOT NULL,
    respuesta_usuario INTEGER,
    correcta          BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS certificacion.certificado (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id          VARCHAR(50)  NOT NULL,
    plan_maestro_id     UUID         NOT NULL,
    plan_titulo         VARCHAR(255) NOT NULL,
    puntaje             INTEGER      NOT NULL,
    codigo_verificacion UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    emitido_en          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pregunta_plan     ON certificacion.pregunta_conocimiento(plan_maestro_id);
CREATE INDEX IF NOT EXISTS idx_examen_usuario    ON certificacion.examen(usuario_id, plan_maestro_id);
CREATE INDEX IF NOT EXISTS idx_certificado_user  ON certificacion.certificado(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cert_verificacion ON certificacion.certificado(codigo_verificacion);
