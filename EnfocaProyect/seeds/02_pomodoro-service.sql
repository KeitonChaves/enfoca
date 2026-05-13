-- Seeds: pomodoro-service
-- 20 sesiones completadas para user_id='1' en los últimos 14 días

SET search_path TO pomodoro;

INSERT INTO pomodoro_sessions (user_id, session_type, status, duration_minutes, start_time, end_time, created_at)
VALUES
  -- Hace 13 días
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '13 days' + INTERVAL '9 hours',  NOW() - INTERVAL '13 days' + INTERVAL '9 hours 25 min',  NOW() - INTERVAL '13 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '13 days' + INTERVAL '10 hours', NOW() - INTERVAL '13 days' + INTERVAL '10 hours 25 min', NOW() - INTERVAL '13 days'),

  -- Hace 12 días
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '12 days' + INTERVAL '8 hours',  NOW() - INTERVAL '12 days' + INTERVAL '8 hours 40 min',  NOW() - INTERVAL '12 days'),
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '12 days' + INTERVAL '10 hours', NOW() - INTERVAL '12 days' + INTERVAL '10 hours 40 min', NOW() - INTERVAL '12 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '12 days' + INTERVAL '15 hours', NOW() - INTERVAL '12 days' + INTERVAL '15 hours 25 min', NOW() - INTERVAL '12 days'),

  -- Hace 11 días (sin actividad — streak break intencional)

  -- Hace 10 días
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '10 days' + INTERVAL '9 hours',  NOW() - INTERVAL '10 days' + INTERVAL '9 hours 50 min',  NOW() - INTERVAL '10 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '10 days' + INTERVAL '11 hours', NOW() - INTERVAL '10 days' + INTERVAL '11 hours 25 min', NOW() - INTERVAL '10 days'),

  -- Hace 9 días
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '9 days' + INTERVAL '9 hours',   NOW() - INTERVAL '9 days' + INTERVAL '9 hours 25 min',   NOW() - INTERVAL '9 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '9 days' + INTERVAL '10 hours',  NOW() - INTERVAL '9 days' + INTERVAL '10 hours 25 min',  NOW() - INTERVAL '9 days'),
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '9 days' + INTERVAL '14 hours',  NOW() - INTERVAL '9 days' + INTERVAL '14 hours 40 min',  NOW() - INTERVAL '9 days'),

  -- Hace 8 días
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '8 days' + INTERVAL '8 hours',   NOW() - INTERVAL '8 days' + INTERVAL '8 hours 50 min',   NOW() - INTERVAL '8 days'),
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '8 days' + INTERVAL '10 hours',  NOW() - INTERVAL '8 days' + INTERVAL '10 hours 50 min',  NOW() - INTERVAL '8 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '8 days' + INTERVAL '16 hours',  NOW() - INTERVAL '8 days' + INTERVAL '16 hours 25 min',  NOW() - INTERVAL '8 days'),

  -- Hace 7 días
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '7 days' + INTERVAL '9 hours',   NOW() - INTERVAL '7 days' + INTERVAL '9 hours 25 min',   NOW() - INTERVAL '7 days'),

  -- Hace 6 días
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '6 days' + INTERVAL '10 hours',  NOW() - INTERVAL '6 days' + INTERVAL '10 hours 40 min',  NOW() - INTERVAL '6 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '6 days' + INTERVAL '13 hours',  NOW() - INTERVAL '6 days' + INTERVAL '13 hours 25 min',  NOW() - INTERVAL '6 days'),

  -- Hace 5 días
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '5 days' + INTERVAL '9 hours',   NOW() - INTERVAL '5 days' + INTERVAL '9 hours 50 min',   NOW() - INTERVAL '5 days'),
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '5 days' + INTERVAL '11 hours',  NOW() - INTERVAL '5 days' + INTERVAL '11 hours 50 min',  NOW() - INTERVAL '5 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '5 days' + INTERVAL '15 hours',  NOW() - INTERVAL '5 days' + INTERVAL '15 hours 25 min',  NOW() - INTERVAL '5 days'),

  -- Hace 4 días
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '4 days' + INTERVAL '8 hours',   NOW() - INTERVAL '4 days' + INTERVAL '8 hours 25 min',   NOW() - INTERVAL '4 days'),
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '4 days' + INTERVAL '10 hours',  NOW() - INTERVAL '4 days' + INTERVAL '10 hours 40 min',  NOW() - INTERVAL '4 days'),

  -- Hace 3 días
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '3 days' + INTERVAL '9 hours',   NOW() - INTERVAL '3 days' + INTERVAL '9 hours 50 min',   NOW() - INTERVAL '3 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '3 days' + INTERVAL '14 hours',  NOW() - INTERVAL '3 days' + INTERVAL '14 hours 25 min',  NOW() - INTERVAL '3 days'),

  -- Hace 2 días
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '2 days' + INTERVAL '9 hours',   NOW() - INTERVAL '2 days' + INTERVAL '9 hours 25 min',   NOW() - INTERVAL '2 days'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '2 days' + INTERVAL '10 hours',  NOW() - INTERVAL '2 days' + INTERVAL '10 hours 25 min',  NOW() - INTERVAL '2 days'),
  ('1', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '2 days' + INTERVAL '16 hours',  NOW() - INTERVAL '2 days' + INTERVAL '16 hours 40 min',  NOW() - INTERVAL '2 days'),

  -- Ayer
  ('1', 'INTENSE',      'COMPLETED', 50, NOW() - INTERVAL '1 day'  + INTERVAL '9 hours',   NOW() - INTERVAL '1 day'  + INTERVAL '9 hours 50 min',   NOW() - INTERVAL '1 day'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '1 day'  + INTERVAL '11 hours',  NOW() - INTERVAL '1 day'  + INTERVAL '11 hours 25 min',  NOW() - INTERVAL '1 day'),
  ('1', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '1 day'  + INTERVAL '15 hours',  NOW() - INTERVAL '1 day'  + INTERVAL '15 hours 25 min',  NOW() - INTERVAL '1 day'),

  -- Sesiones de user_id=2
  ('2', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '5 days' + INTERVAL '10 hours',  NOW() - INTERVAL '5 days' + INTERVAL '10 hours 25 min',  NOW() - INTERVAL '5 days'),
  ('2', 'STANDARD',     'COMPLETED', 25, NOW() - INTERVAL '3 days' + INTERVAL '10 hours',  NOW() - INTERVAL '3 days' + INTERVAL '10 hours 25 min',  NOW() - INTERVAL '3 days'),
  ('2', 'INTERMEDIATE', 'COMPLETED', 40, NOW() - INTERVAL '1 day'  + INTERVAL '10 hours',  NOW() - INTERVAL '1 day'  + INTERVAL '10 hours 40 min',  NOW() - INTERVAL '1 day');
