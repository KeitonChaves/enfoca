-- Seeds: auth-service
-- Contraseña para ambos usuarios: Enfoca2026!
-- Requiere extensión pgcrypto (disponible en postgres:15)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET search_path TO auth;

INSERT INTO users (id, nombre, last_name, email, password_hash, role, active, created_at, updated_at)
VALUES
  (1, 'Felipe',  'Ulloa',   'felipe@test.com', crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW(), NOW()),
  (2, 'María',   'García',  'maria@test.com',  crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW(), NOW()),
  (3, 'Carlos',  'Mendoza', 'carlos@test.com', crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Ajustar secuencia para que los próximos registros no colisionen
SELECT setval('users_id_seq', 10);
