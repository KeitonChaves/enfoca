-- Seeds: ai-service
-- usuario_id es el id del usuario como String (igual al subject del JWT)
-- Requiere que la migración V2 ya haya corrido (UUID → VARCHAR)

SET search_path TO planes;

-- ================================================================
-- PLANES DE ESTUDIO
-- ================================================================

INSERT INTO plan_estudio (id, usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, creado_en)
VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', '1', 'Algoritmos y Estructuras de Datos',
   'Dominar estructuras clásicas (listas, árboles, grafos) y algoritmos de ordenamiento y búsqueda.',
   'INTERMEDIO', 'ACTIVO', 4.2, 5, NOW() - INTERVAL '10 days'),

  ('a1b2c3d4-0002-0000-0000-000000000001', '1', 'Cálculo Integral',
   'Comprender integrales definidas e indefinidas, técnicas de integración y sus aplicaciones.',
   'BASICO', 'ACTIVO', 0.0, 0, NOW() - INTERVAL '5 days'),

  ('a1b2c3d4-0003-0000-0000-000000000001', '1', 'Introducción a la Historia del Arte',
   'Recorrer los movimientos artísticos desde el Renacimiento hasta el arte contemporáneo.',
   'BASICO', 'COMPLETADO', 4.8, 3, NOW() - INTERVAL '30 days'),

  ('a1b2c3d4-0001-0000-0000-000000000002', '2', 'Diseño de Bases de Datos',
   'Modelado entidad-relación, normalización y consultas SQL avanzadas.',
   'INTERMEDIO', 'ACTIVO', 0.0, 0, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- MÓDULOS — Plan 1: Algoritmos
-- ================================================================

INSERT INTO modulo (id, plan_id, orden, titulo) VALUES
  ('b1000000-0001-0001-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 1, 'Estructuras Lineales'),
  ('b1000000-0001-0002-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 2, 'Estructuras No Lineales'),
  ('b1000000-0001-0003-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', 3, 'Algoritmos de Búsqueda y Ordenamiento')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- TEMAS — Módulo 1
-- ================================================================

INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  ('c1000000-0001-0001-0001-000000000001', 'b1000000-0001-0001-0000-000000000001', 1, 'Listas enlazadas simples y dobles', 3, 3, true,  NOW() - INTERVAL '9 days'),
  ('c1000000-0001-0001-0002-000000000001', 'b1000000-0001-0001-0000-000000000001', 2, 'Pilas y colas',                    2, 2, true,  NOW() - INTERVAL '8 days'),
  ('c1000000-0001-0001-0003-000000000001', 'b1000000-0001-0001-0000-000000000001', 3, 'Colas de prioridad y heaps',       3, 1, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Módulo 2
INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  ('c1000000-0001-0002-0001-000000000001', 'b1000000-0001-0002-0000-000000000001', 1, 'Árboles binarios y BST',           4, 2, false, NULL),
  ('c1000000-0001-0002-0002-000000000001', 'b1000000-0001-0002-0000-000000000001', 2, 'Árboles AVL y rojo-negro',         4, 0, false, NULL),
  ('c1000000-0001-0002-0003-000000000001', 'b1000000-0001-0002-0000-000000000001', 3, 'Grafos: representación y recorrido', 5, 0, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- Módulo 3
INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  ('c1000000-0001-0003-0001-000000000001', 'b1000000-0001-0003-0000-000000000001', 1, 'Búsqueda lineal y binaria',        2, 0, false, NULL),
  ('c1000000-0001-0003-0002-000000000001', 'b1000000-0001-0003-0000-000000000001', 2, 'QuickSort y MergeSort',            3, 0, false, NULL),
  ('c1000000-0001-0003-0003-000000000001', 'b1000000-0001-0003-0000-000000000001', 3, 'Algoritmos de grafos: Dijkstra, BFS, DFS', 4, 0, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- MÓDULOS — Plan 2: Cálculo Integral
-- ================================================================

INSERT INTO modulo (id, plan_id, orden, titulo) VALUES
  ('b1000000-0002-0001-0000-000000000001', 'a1b2c3d4-0002-0000-0000-000000000001', 1, 'Integrales Indefinidas'),
  ('b1000000-0002-0002-0000-000000000001', 'a1b2c3d4-0002-0000-0000-000000000001', 2, 'Integrales Definidas y Aplicaciones')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  ('c1000000-0002-0001-0001-000000000001', 'b1000000-0002-0001-0000-000000000001', 1, 'Antiderivadas y reglas básicas', 2, 2, true, NOW() - INTERVAL '4 days'),
  ('c1000000-0002-0001-0002-000000000001', 'b1000000-0002-0001-0000-000000000001', 2, 'Integración por partes',         3, 1, false, NULL),
  ('c1000000-0002-0001-0003-000000000001', 'b1000000-0002-0001-0000-000000000001', 3, 'Sustitución trigonométrica',     3, 0, false, NULL),
  ('c1000000-0002-0002-0001-000000000001', 'b1000000-0002-0002-0000-000000000001', 1, 'Teorema fundamental del cálculo', 2, 0, false, NULL),
  ('c1000000-0002-0002-0002-000000000001', 'b1000000-0002-0002-0000-000000000001', 2, 'Área entre curvas y volúmenes de revolución', 4, 0, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- MÓDULOS — Plan 3: Historia del Arte (COMPLETADO)
-- ================================================================

INSERT INTO modulo (id, plan_id, orden, titulo) VALUES
  ('b1000000-0003-0001-0000-000000000001', 'a1b2c3d4-0003-0000-0000-000000000001', 1, 'Arte Clásico y Renacentista'),
  ('b1000000-0003-0002-0000-000000000001', 'a1b2c3d4-0003-0000-0000-000000000001', 2, 'Modernismo y Arte Contemporáneo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  ('c1000000-0003-0001-0001-000000000001', 'b1000000-0003-0001-0000-000000000001', 1, 'El Renacimiento italiano', 2, 2, true, NOW() - INTERVAL '25 days'),
  ('c1000000-0003-0001-0002-000000000001', 'b1000000-0003-0001-0000-000000000001', 2, 'Barroco y Rococó',         2, 2, true, NOW() - INTERVAL '22 days'),
  ('c1000000-0003-0002-0001-000000000001', 'b1000000-0003-0002-0000-000000000001', 1, 'Impresionismo y Post-impresionismo', 2, 2, true, NOW() - INTERVAL '18 days'),
  ('c1000000-0003-0002-0002-000000000001', 'b1000000-0003-0002-0000-000000000001', 2, 'Vanguardias del siglo XX', 3, 3, true, NOW() - INTERVAL '14 days')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- VALIDACIONES — Plan 1 y Plan 3
-- ================================================================

INSERT INTO validacion (id, plan_id, usuario_id, puntaje, comentario, creado_en) VALUES
  ('d1000000-0001-0001-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', '2', 4, 'Muy bien estructurado, cubre todos los temas fundamentales.', NOW() - INTERVAL '7 days'),
  ('d1000000-0001-0002-0000-000000000001', 'a1b2c3d4-0001-0000-0000-000000000001', '3', 5, 'Excelente plan, lo recomiendo.', NOW() - INTERVAL '5 days'),
  ('d1000000-0003-0001-0000-000000000001', 'a1b2c3d4-0003-0000-0000-000000000001', '2', 5, 'Me ayudó mucho para el examen final.', NOW() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;
