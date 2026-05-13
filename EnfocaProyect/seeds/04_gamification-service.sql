-- Seeds: gamification-service

-- Perfil de gamificación por usuario
INSERT INTO gamificacion (usuario_id, xp_total, nivel, created_at, updated_at)
VALUES
  ('1', 1350, 5, NOW() - INTERVAL '13 days', NOW() - INTERVAL '1 day'),
  ('2', 275,  2, NOW() - INTERVAL '5 days',  NOW() - INTERVAL '1 day'),
  ('3', 50,   1, NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days')
ON CONFLICT (usuario_id) DO NOTHING;

-- Insignias desbloqueadas para usuario 1
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '1', id, NOW() - INTERVAL '12 days' FROM insignias WHERE codigo = 'PRIMERA_SESION'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;

INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '1', id, NOW() - INTERVAL '8 days'  FROM insignias WHERE codigo = 'SESIONES_10'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;

INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '1', id, NOW() - INTERVAL '7 days'  FROM insignias WHERE codigo = 'RACHA_3'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;

INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '1', id, NOW() - INTERVAL '3 days'  FROM insignias WHERE codigo = 'XP_500'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;

INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '1', id, NOW() - INTERVAL '1 day'   FROM insignias WHERE codigo = 'RACHA_7'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;

-- Insignias desbloqueadas para usuario 2
INSERT INTO usuario_insignias (usuario_id, insignia_id, desbloqueada_at)
SELECT '2', id, NOW() - INTERVAL '4 days'  FROM insignias WHERE codigo = 'PRIMERA_SESION'
ON CONFLICT (usuario_id, insignia_id) DO NOTHING;
