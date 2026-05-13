-- Seeds: gamification-service — 10 usuarios con XP, niveles e insignias

INSERT INTO gamificacion (usuario_id, xp_total, nivel, created_at, updated_at) VALUES
  (100,  2450,  8, NOW()-INTERVAL'60 days', NOW()-INTERVAL'1 day'),
  (101,  1850,  6, NOW()-INTERVAL'55 days', NOW()-INTERVAL'1 day'),
  (102,  1320,  5, NOW()-INTERVAL'50 days', NOW()-INTERVAL'2 days'),
  (103,  980,   4, NOW()-INTERVAL'45 days', NOW()-INTERVAL'1 day'),
  (104,  2100,  7, NOW()-INTERVAL'40 days', NOW()-INTERVAL'1 day'),
  ('6',  420,   2, NOW()-INTERVAL'35 days', NOW()-INTERVAL'5 days'),
  ('7',  680,   3, NOW()-INTERVAL'30 days', NOW()-INTERVAL'3 days'),
  ('8',  150,   1, NOW()-INTERVAL'25 days', NOW()-INTERVAL'10 days'),
  ('9',  310,   2, NOW()-INTERVAL'20 days', NOW()-INTERVAL'4 days'),
  ('10', 90,    1, NOW()-INTERVAL'15 days', NOW()-INTERVAL'12 days')
ON CONFLICT (usuario_id) DO NOTHING;

-- Insignias para usuario 1 (Felipe — avanzado)
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'55 days' FROM insignias WHERE codigo='PRIMERA_SESION' ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'45 days' FROM insignias WHERE codigo='SESIONES_10'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'30 days' FROM insignias WHERE codigo='SESIONES_50'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'50 days' FROM insignias WHERE codigo='RACHA_3'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'40 days' FROM insignias WHERE codigo='RACHA_7'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'15 days' FROM insignias WHERE codigo='RACHA_30'       ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'35 days' FROM insignias WHERE codigo='XP_500'         ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'20 days' FROM insignias WHERE codigo='XP_2000'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'25 days' FROM insignias WHERE codigo='NIVEL_5'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 100, id, NOW()-INTERVAL'10 days' FROM insignias WHERE codigo='NIVEL_10'       ON CONFLICT DO NOTHING;

-- Insignias para usuario 2 (María)
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'50 days' FROM insignias WHERE codigo='PRIMERA_SESION' ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'40 days' FROM insignias WHERE codigo='SESIONES_10'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'20 days' FROM insignias WHERE codigo='SESIONES_50'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'45 days' FROM insignias WHERE codigo='RACHA_3'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'30 days' FROM insignias WHERE codigo='RACHA_7'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'28 days' FROM insignias WHERE codigo='XP_500'         ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 101, id, NOW()-INTERVAL'5 days'  FROM insignias WHERE codigo='XP_2000'        ON CONFLICT DO NOTHING;

-- Insignias para usuario 3 (Carlos)
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 102, id, NOW()-INTERVAL'45 days' FROM insignias WHERE codigo='PRIMERA_SESION' ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 102, id, NOW()-INTERVAL'35 days' FROM insignias WHERE codigo='SESIONES_10'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 102, id, NOW()-INTERVAL'25 days' FROM insignias WHERE codigo='RACHA_3'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 102, id, NOW()-INTERVAL'20 days' FROM insignias WHERE codigo='XP_500'         ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 102, id, NOW()-INTERVAL'8 days'  FROM insignias WHERE codigo='NIVEL_5'        ON CONFLICT DO NOTHING;

-- Insignias para usuarios 4 y 5
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 103, id, NOW()-INTERVAL'40 days' FROM insignias WHERE codigo='PRIMERA_SESION' ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 103, id, NOW()-INTERVAL'25 days' FROM insignias WHERE codigo='SESIONES_10'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 103, id, NOW()-INTERVAL'15 days' FROM insignias WHERE codigo='XP_500'         ON CONFLICT DO NOTHING;

INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'35 days' FROM insignias WHERE codigo='PRIMERA_SESION' ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'28 days' FROM insignias WHERE codigo='SESIONES_10'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'15 days' FROM insignias WHERE codigo='SESIONES_50'    ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'30 days' FROM insignias WHERE codigo='RACHA_3'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'20 days' FROM insignias WHERE codigo='RACHA_7'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'22 days' FROM insignias WHERE codigo='XP_500'         ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'8 days'  FROM insignias WHERE codigo='XP_2000'        ON CONFLICT DO NOTHING;
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT 104, id, NOW()-INTERVAL'12 days' FROM insignias WHERE codigo='NIVEL_5'        ON CONFLICT DO NOTHING;
