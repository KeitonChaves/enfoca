-- Seeds: metrics-service
-- Resúmenes diarios para usuario 1 (últimos 14 días activos)
-- Los minutos coinciden con las sesiones del seed de pomodoro

SET search_path TO metrics;

INSERT INTO daily_summaries (user_id, summary_date, focused_minutes, sessions_count, cycles_count)
VALUES
  -- Hace 13 días: 2 sesiones × 25 min
  (1, CURRENT_DATE - 13, 50,  2, 2),
  -- Hace 12 días: 2×40 + 1×25 = 105 min
  (1, CURRENT_DATE - 12, 105, 3, 3),
  -- Hace 11 días: sin actividad → no hay fila
  -- Hace 10 días: 1×50 + 1×25 = 75 min
  (1, CURRENT_DATE - 10, 75,  2, 2),
  -- Hace 9 días: 2×25 + 1×40 = 90 min
  (1, CURRENT_DATE - 9,  90,  3, 3),
  -- Hace 8 días: 2×50 + 1×25 = 125 min
  (1, CURRENT_DATE - 8,  125, 3, 4),
  -- Hace 7 días: 1×25
  (1, CURRENT_DATE - 7,  25,  1, 1),
  -- Hace 6 días: 1×40 + 1×25 = 65 min
  (1, CURRENT_DATE - 6,  65,  2, 2),
  -- Hace 5 días: 2×50 + 1×25 = 125 min
  (1, CURRENT_DATE - 5,  125, 3, 4),
  -- Hace 4 días: 1×25 + 1×40 = 65 min
  (1, CURRENT_DATE - 4,  65,  2, 2),
  -- Hace 3 días: 1×50 + 1×25 = 75 min
  (1, CURRENT_DATE - 3,  75,  2, 2),
  -- Hace 2 días: 2×25 + 1×40 = 90 min
  (1, CURRENT_DATE - 2,  90,  3, 3),
  -- Ayer: 1×50 + 2×25 = 100 min
  (1, CURRENT_DATE - 1,  100, 3, 3)
ON CONFLICT (user_id, summary_date) DO NOTHING;

-- Streak de usuario 1: 8 días consecutivos (roto hace 11 días, reiniciado hace 10)
INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date)
VALUES (1, 8, 12, CURRENT_DATE - 1)
ON CONFLICT (user_id) DO NOTHING;

-- Streak de usuario 2
INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date)
VALUES (2, 1, 3, CURRENT_DATE - 1)
ON CONFLICT (user_id) DO NOTHING;

-- AI Insight semanal para usuario 1
INSERT INTO ai_insights (user_id, week_start, summary, best_day, recommendation)
VALUES (
  1,
  DATE_TRUNC('week', CURRENT_DATE)::date,
  'Esta semana lograste 355 minutos de enfoque profundo distribuidos en 11 sesiones. '
  'Tu rendimiento es consistente con un pico notable los días de mayor intensidad. '
  'Mantuviste una racha activa que refleja disciplina en el estudio.',
  'Jueves',
  'Considera añadir una sesión de revisión al final de cada módulo completado para consolidar el aprendizaje a largo plazo.'
)
ON CONFLICT (user_id, week_start) DO NOTHING;
