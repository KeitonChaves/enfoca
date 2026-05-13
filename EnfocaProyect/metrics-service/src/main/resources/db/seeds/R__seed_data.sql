-- Seeds: metrics-service — 30 días de datos para usuarios 1-5

SET search_path TO metrics;

-- ================================================================
-- DAILY SUMMARIES — usuario 1 (Felipe, muy activo) — 28 días
-- ================================================================
INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count) VALUES
  (1,CURRENT_DATE-30, 50, 2,2),(1,CURRENT_DATE-29, 80, 2,3),
  (1,CURRENT_DATE-28, 50, 1,2),(1,CURRENT_DATE-27, 50, 2,2),
  (1,CURRENT_DATE-26, 50, 1,2),(1,CURRENT_DATE-25, 50, 1,2),
  (1,CURRENT_DATE-24, 40, 1,1),(1,CURRENT_DATE-23, 50, 2,2),
  (1,CURRENT_DATE-22, 25, 1,1),(1,CURRENT_DATE-21, 40, 1,1),
  (1,CURRENT_DATE-20, 50, 1,2),(1,CURRENT_DATE-19, 50, 1,2),
  (1,CURRENT_DATE-18, 25, 1,1),(1,CURRENT_DATE-17, 40, 1,1),
  (1,CURRENT_DATE-16, 25, 1,1),(1,CURRENT_DATE-15, 50, 1,2),
  (1,CURRENT_DATE-10, 25, 1,1),(1,CURRENT_DATE-9,  40, 1,1),
  (1,CURRENT_DATE-8,  50, 1,2),(1,CURRENT_DATE-7,  25, 1,1),
  (1,CURRENT_DATE-5,  25, 1,1),(1,CURRENT_DATE-3,  40, 1,1),
  (1,CURRENT_DATE-2,  50, 1,2),(1,CURRENT_DATE-1, 100, 3,3)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- ================================================================
-- DAILY SUMMARIES — usuario 2 (María, activa) — 22 días
-- ================================================================
INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count) VALUES
  (2,CURRENT_DATE-28, 25, 1,1),(2,CURRENT_DATE-26, 40, 1,1),
  (2,CURRENT_DATE-25, 25, 1,1),(2,CURRENT_DATE-24, 50, 1,2),
  (2,CURRENT_DATE-22, 25, 1,1),(2,CURRENT_DATE-21, 40, 1,1),
  (2,CURRENT_DATE-20, 25, 1,1),(2,CURRENT_DATE-18, 25, 1,1),
  (2,CURRENT_DATE-17, 50, 1,2),(2,CURRENT_DATE-15, 25, 1,1),
  (2,CURRENT_DATE-13, 40, 1,1),(2,CURRENT_DATE-11, 25, 1,1),
  (2,CURRENT_DATE-9,  25, 1,1),(2,CURRENT_DATE-7,  50, 1,2),
  (2,CURRENT_DATE-6,  25, 1,1),(2,CURRENT_DATE-5,  40, 1,1),
  (2,CURRENT_DATE-4,  25, 1,1),(2,CURRENT_DATE-3,  25, 1,1),
  (2,CURRENT_DATE-2,  50, 1,2),(2,CURRENT_DATE-1, 165, 4,5)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- ================================================================
-- DAILY SUMMARIES — usuario 3 (Carlos, constante) — 20 días
-- ================================================================
INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count) VALUES
  (3,CURRENT_DATE-25, 25, 1,1),(3,CURRENT_DATE-24, 40, 1,1),
  (3,CURRENT_DATE-21, 50, 1,2),(3,CURRENT_DATE-20, 25, 1,1),
  (3,CURRENT_DATE-17, 40, 1,1),(3,CURRENT_DATE-15, 25, 1,1),
  (3,CURRENT_DATE-13, 50, 1,2),(3,CURRENT_DATE-11, 40, 1,1),
  (3,CURRENT_DATE-9,  25, 1,1),(3,CURRENT_DATE-7,  25, 1,1),
  (3,CURRENT_DATE-6,  50, 1,2),(3,CURRENT_DATE-4,  40, 1,1),
  (3,CURRENT_DATE-3,  25, 1,1),(3,CURRENT_DATE-2,  25, 1,1),
  (3,CURRENT_DATE-1, 175, 4,5)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- ================================================================
-- DAILY SUMMARIES — usuario 4 (Ana, activa últimas 3 semanas) — 20 días
-- ================================================================
INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count) VALUES
  (4,CURRENT_DATE-20, 25, 1,1),(4,CURRENT_DATE-19, 40, 1,1),
  (4,CURRENT_DATE-18, 25, 1,1),(4,CURRENT_DATE-17, 25, 1,1),
  (4,CURRENT_DATE-16, 50, 1,2),(4,CURRENT_DATE-15, 25, 1,1),
  (4,CURRENT_DATE-14, 40, 1,1),(4,CURRENT_DATE-13, 25, 1,1),
  (4,CURRENT_DATE-12, 25, 1,1),(4,CURRENT_DATE-11, 50, 1,2),
  (4,CURRENT_DATE-10, 25, 1,1),(4,CURRENT_DATE-9,  40, 1,1),
  (4,CURRENT_DATE-7,  25, 1,1),(4,CURRENT_DATE-6,  50, 1,2),
  (4,CURRENT_DATE-5,  25, 1,1),(4,CURRENT_DATE-4,  25, 1,1),
  (4,CURRENT_DATE-3,  40, 1,1),(4,CURRENT_DATE-2,  25, 1,1),
  (4,CURRENT_DATE-1, 165, 3,4)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- ================================================================
-- DAILY SUMMARIES — usuario 5 (Diego, muy activo últimas 2 semanas) — 20 días
-- ================================================================
INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count) VALUES
  (5,CURRENT_DATE-15, 40, 1,1),(5,CURRENT_DATE-14, 25, 1,1),
  (5,CURRENT_DATE-13, 25, 1,1),(5,CURRENT_DATE-12, 50, 1,2),
  (5,CURRENT_DATE-11, 25, 1,1),(5,CURRENT_DATE-10, 40, 1,1),
  (5,CURRENT_DATE-9,  25, 1,1),(5,CURRENT_DATE-8,  25, 1,1),
  (5,CURRENT_DATE-7,  50, 1,2),(5,CURRENT_DATE-6,  25, 1,1),
  (5,CURRENT_DATE-5,  40, 1,1),(5,CURRENT_DATE-4,  25, 1,1),
  (5,CURRENT_DATE-3,  25, 1,1),(5,CURRENT_DATE-2,  50, 1,2),
  (5,CURRENT_DATE-1, 240, 5,6)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- ================================================================
-- STREAKS
-- ================================================================
INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date) VALUES
  (1, 15, 30, CURRENT_DATE-1),
  (2, 20, 22, CURRENT_DATE-1),
  (3, 15, 18, CURRENT_DATE-1),
  (4, 19, 20, CURRENT_DATE-1),
  (5, 15, 16, CURRENT_DATE-1)
ON CONFLICT (user_id) DO NOTHING;

-- ================================================================
-- AI INSIGHTS
-- ================================================================
INSERT INTO ai_insights (user_id, week_start, summary, best_day, recommendation) VALUES
  (1, DATE_TRUNC('week', CURRENT_DATE)::date,
   'Esta semana alcanzaste 265 minutos de enfoque profundo en 7 sesiones. Tu consistencia es notable con un promedio de 38 minutos por sesión.',
   'Martes', 'Intenta bloques de enfoque más largos por las mañanas cuando tu concentración está en su punto más alto.'),
  (2, DATE_TRUNC('week', CURRENT_DATE)::date,
   'Completaste 22 sesiones en la semana con un total de 165 minutos. Destacas por mantener ritmo diario sin interrupciones.',
   'Jueves', 'Considera agregar una sesión vespertina los viernes para aprovechar el impulso del cierre de semana.'),
  (3, DATE_TRUNC('week', CURRENT_DATE)::date,
   'Semana sólida con 15 sesiones y 175 minutos de foco. Tu racha activa de 15 días es tu mejor marca histórica.',
   'Miércoles', 'Prueba la técnica Pomodoro intensivo (50 min) los días que tengas más energía.'),
  (4, DATE_TRUNC('week', CURRENT_DATE)::date,
   'Excelente semana con 19 sesiones activas. Mantuviste la racha más larga de tu historial con coherencia en los horarios.',
   'Lunes', 'Diversifica los tipos de sesión — alternar estándar e intenso maximiza la retención a largo plazo.'),
  (5, DATE_TRUNC('week', CURRENT_DATE)::date,
   'Semana extraordinaria: 15 sesiones y 240 minutos solo el último día. Tu intensidad al final de semana es tu punto fuerte.',
   'Domingo', 'Redistribuye parte de la carga del domingo a mitad de semana para mayor consistencia diaria.')
ON CONFLICT (user_id, week_start) DO NOTHING;
