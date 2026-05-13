-- Seeds: auth-service — 10 usuarios de prueba
-- Contraseña de todos: Enfoca2026!

CREATE EXTENSION IF NOT EXISTS pgcrypto;

SET search_path TO auth;

INSERT INTO users (id, nombre, last_name, email, password_hash, role, active, created_at, updated_at) VALUES
  (1,  'Felipe',    'Ulloa',     'felipe@test.com',     crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '60 days', NOW()),
  (2,  'María',     'García',    'maria@test.com',      crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '55 days', NOW()),
  (3,  'Carlos',    'Mendoza',   'carlos@test.com',     crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '50 days', NOW()),
  (4,  'Ana',       'Martínez',  'ana@test.com',        crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '45 days', NOW()),
  (5,  'Diego',     'Rodríguez', 'diego@test.com',      crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '40 days', NOW()),
  (6,  'Sofía',     'López',     'sofia@test.com',      crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '35 days', NOW()),
  (7,  'Mateo',     'González',  'mateo@test.com',      crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '30 days', NOW()),
  (8,  'Valentina', 'Pérez',     'valentina@test.com',  crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '25 days', NOW()),
  (9,  'Sebastián', 'Torres',    'sebastian@test.com',  crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '20 days', NOW()),
  (10, 'Camila',    'Soto',      'camila@test.com',     crypt('Enfoca2026!', gen_salt('bf', 10)), 'USER', true, NOW() - INTERVAL '15 days', NOW())
ON CONFLICT (email) DO NOTHING;

SELECT setval('users_id_seq', 20);
