-- Seeds: ai-service — 20+ planes distribuidos entre usuarios 1-5

SET search_path TO planes;

-- ================================================================
-- PLANES (22 en total)
-- ================================================================
INSERT INTO plan_estudio (id, usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, creado_en) VALUES
  ('a0000001-0001-0000-0000-000000000001','1','Algoritmos y Estructuras de Datos','Dominar estructuras clásicas y algoritmos de ordenamiento.','INTERMEDIO','ACTIVO',  4.2, 5, NOW()-INTERVAL'10 days'),
  ('a0000001-0002-0000-0000-000000000001','1','Cálculo Integral',                 'Comprender integrales y sus aplicaciones.',                'BASICO',    'ACTIVO',  0.0, 0, NOW()-INTERVAL'5 days'),
  ('a0000001-0003-0000-0000-000000000001','1','Historia del Arte',                'Recorrer movimientos desde el Renacimiento hasta hoy.',    'BASICO',    'COMPLETADO',4.8,3, NOW()-INTERVAL'30 days'),
  ('a0000001-0004-0000-0000-000000000001','1','Programación Orientada a Objetos', 'Dominar POO: herencia, polimorfismo y patrones.',          'INTERMEDIO','ACTIVO',  3.5, 2, NOW()-INTERVAL'8 days'),
  ('a0000001-0005-0000-0000-000000000001','1','Bases de Datos Avanzadas',         'Optimización de consultas, índices y transacciones.',      'AVANZADO',  'ACTIVO',  0.0, 0, NOW()-INTERVAL'3 days'),

  ('a0000002-0001-0000-0000-000000000002','2','Diseño de Bases de Datos',         'Modelado ER, normalización y SQL avanzado.',               'INTERMEDIO','ACTIVO',  0.0, 0, NOW()-INTERVAL'3 days'),
  ('a0000002-0002-0000-0000-000000000002','2','Redes de Computadoras',            'Protocolos TCP/IP, routing y seguridad de red.',          'INTERMEDIO','ACTIVO',  4.0, 1, NOW()-INTERVAL'12 days'),
  ('a0000002-0003-0000-0000-000000000002','2','Sistemas Operativos',              'Procesos, memoria virtual y sistemas de archivos.',        'AVANZADO',  'COMPLETADO',5.0,4, NOW()-INTERVAL'25 days'),
  ('a0000002-0004-0000-0000-000000000002','2','Inteligencia Artificial',          'Machine learning, redes neuronales y NLP.',               'AVANZADO',  'ACTIVO',  0.0, 0, NOW()-INTERVAL'6 days'),

  ('a0000003-0001-0000-0000-000000000003','3','Análisis Matemático',              'Series, límites, derivadas e integrales múltiples.',       'AVANZADO',  'ACTIVO',  3.8, 3, NOW()-INTERVAL'15 days'),
  ('a0000003-0002-0000-0000-000000000003','3','Física Mecánica',                  'Cinemática, dinámica y energía.',                         'BASICO',    'COMPLETADO',4.5,2, NOW()-INTERVAL'20 days'),
  ('a0000003-0003-0000-0000-000000000003','3','Química Orgánica',                 'Grupos funcionales, reacciones y síntesis.',               'INTERMEDIO','ACTIVO',  0.0, 0, NOW()-INTERVAL'7 days'),
  ('a0000003-0004-0000-0000-000000000003','3','Estadística y Probabilidad',       'Distribuciones, hipótesis y regresión.',                   'INTERMEDIO','ACTIVO',  4.2, 1, NOW()-INTERVAL'4 days'),

  ('a0000004-0001-0000-0000-000000000004','4','Introducción a la Programación',   'Fundamentos de Python: variables, bucles y funciones.',    'BASICO',    'COMPLETADO',4.9,6, NOW()-INTERVAL'35 days'),
  ('a0000004-0002-0000-0000-000000000004','4','Desarrollo Web Frontend',          'HTML, CSS, JavaScript y React.',                          'INTERMEDIO','ACTIVO',  4.3, 2, NOW()-INTERVAL'18 days'),
  ('a0000004-0003-0000-0000-000000000004','4','Inglés Técnico',                   'Vocabulario, lectura y escritura técnica en inglés.',      'BASICO',    'ACTIVO',  3.0, 1, NOW()-INTERVAL'9 days'),
  ('a0000004-0004-0000-0000-000000000004','4','Microeconomía',                    'Oferta, demanda, elasticidad y teoría del consumidor.',    'BASICO',    'ACTIVO',  0.0, 0, NOW()-INTERVAL'2 days'),

  ('a0000005-0001-0000-0000-000000000005','5','Arquitectura de Software',         'Patrones arquitectónicos, microservicios y DDD.',          'AVANZADO',  'ACTIVO',  4.7, 3, NOW()-INTERVAL'11 days'),
  ('a0000005-0002-0000-0000-000000000005','5','DevOps y CI/CD',                   'Docker, Kubernetes, pipelines y monitoreo.',               'AVANZADO',  'ACTIVO',  3.5, 1, NOW()-INTERVAL'14 days'),
  ('a0000005-0003-0000-0000-000000000005','5','Seguridad Informática',            'Criptografía, vulnerabilidades y ethical hacking.',        'AVANZADO',  'COMPLETADO',4.6,4, NOW()-INTERVAL'28 days'),
  ('a0000005-0004-0000-0000-000000000005','5','Cloud Computing AWS',              'EC2, S3, RDS y arquitecturas serverless.',                 'INTERMEDIO','ACTIVO',  0.0, 0, NOW()-INTERVAL'5 days'),
  ('a0000005-0005-0000-0000-000000000005','5','Metodologías Ágiles',              'Scrum, Kanban y gestión de proyectos de software.',        'BASICO',    'COMPLETADO',5.0,5, NOW()-INTERVAL'40 days')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- MÓDULOS (2-3 por plan, solo planes activos principales)
-- ================================================================
INSERT INTO modulo (id, plan_id, orden, titulo) VALUES
  -- Plan 1 (Algoritmos)
  ('b0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001',1,'Estructuras Lineales'),
  ('b0000001-0002-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001',2,'Árboles y Grafos'),
  ('b0000001-0003-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001',3,'Algoritmos de Ordenamiento'),
  -- Plan 2 (Cálculo)
  ('b0000001-0001-0000-0000-000000000002','a0000001-0002-0000-0000-000000000001',1,'Integrales Indefinidas'),
  ('b0000001-0002-0000-0000-000000000002','a0000001-0002-0000-0000-000000000001',2,'Integrales Definidas y Aplicaciones'),
  -- Plan 4 (POO)
  ('b0000001-0001-0000-0000-000000000004','a0000001-0004-0000-0000-000000000001',1,'Fundamentos de POO'),
  ('b0000001-0002-0000-0000-000000000004','a0000001-0004-0000-0000-000000000001',2,'Patrones de Diseño'),
  -- Plan 6 (Bases de Datos)
  ('b0000002-0001-0000-0000-000000000006','a0000002-0001-0000-0000-000000000002',1,'Modelo Entidad-Relación'),
  ('b0000002-0002-0000-0000-000000000006','a0000002-0001-0000-0000-000000000002',2,'SQL Avanzado'),
  -- Plan 10 (Análisis Matemático)
  ('b0000003-0001-0000-0000-000000000010','a0000003-0001-0000-0000-000000000003',1,'Series y Sucesiones'),
  ('b0000003-0002-0000-0000-000000000010','a0000003-0001-0000-0000-000000000003',2,'Cálculo Multivariable'),
  -- Plan 15 (Desarrollo Web)
  ('b0000004-0001-0000-0000-000000000015','a0000004-0002-0000-0000-000000000004',1,'HTML y CSS Moderno'),
  ('b0000004-0002-0000-0000-000000000015','a0000004-0002-0000-0000-000000000004',2,'JavaScript y React'),
  -- Plan 18 (Arquitectura)
  ('b0000005-0001-0000-0000-000000000018','a0000005-0001-0000-0000-000000000005',1,'Patrones Arquitectónicos'),
  ('b0000005-0002-0000-0000-000000000018','a0000005-0001-0000-0000-000000000005',2,'Microservicios y DDD')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- TEMAS
-- ================================================================
INSERT INTO tema (id, modulo_id, orden, titulo, pomodoros_estimados, pomodoros_completados, completado, completado_en) VALUES
  -- Módulos Plan 1 (Algoritmos)
  ('c0000001-0001-0001-0000-000000000001','b0000001-0001-0000-0000-000000000001',1,'Listas enlazadas',3,3,true, NOW()-INTERVAL'9 days'),
  ('c0000001-0001-0002-0000-000000000001','b0000001-0001-0000-0000-000000000001',2,'Pilas y colas',   2,2,true, NOW()-INTERVAL'8 days'),
  ('c0000001-0001-0003-0000-000000000001','b0000001-0001-0000-0000-000000000001',3,'Heaps',           3,1,false,NULL),
  ('c0000001-0002-0001-0000-000000000001','b0000001-0002-0000-0000-000000000001',1,'Árboles BST',     4,2,false,NULL),
  ('c0000001-0002-0002-0000-000000000001','b0000001-0002-0000-0000-000000000001',2,'Grafos BFS/DFS',  5,0,false,NULL),
  ('c0000001-0003-0001-0000-000000000001','b0000001-0003-0000-0000-000000000001',1,'QuickSort',       2,0,false,NULL),
  ('c0000001-0003-0002-0000-000000000001','b0000001-0003-0000-0000-000000000001',2,'MergeSort',       2,0,false,NULL),
  -- Módulos Plan 2 (Cálculo)
  ('c0000001-0001-0001-0000-000000000002','b0000001-0001-0000-0000-000000000002',1,'Antiderivadas',   2,2,true, NOW()-INTERVAL'4 days'),
  ('c0000001-0001-0002-0000-000000000002','b0000001-0001-0000-0000-000000000002',2,'Integr. por partes',3,1,false,NULL),
  ('c0000001-0002-0001-0000-000000000002','b0000001-0002-0000-0000-000000000002',1,'Teorema fundamental',2,0,false,NULL),
  -- Módulos Plan 6 (Bases de Datos)
  ('c0000002-0001-0001-0000-000000000006','b0000002-0001-0000-0000-000000000006',1,'Diagrama ER',     2,0,false,NULL),
  ('c0000002-0001-0002-0000-000000000006','b0000002-0001-0000-0000-000000000006',2,'Normalización',   3,0,false,NULL),
  ('c0000002-0002-0001-0000-000000000006','b0000002-0002-0000-0000-000000000006',1,'JOINs avanzados', 2,0,false,NULL),
  ('c0000002-0002-0002-0000-000000000006','b0000002-0002-0000-0000-000000000006',2,'Índices y planes',3,0,false,NULL),
  -- Módulos Plan 15 (Desarrollo Web)
  ('c0000004-0001-0001-0000-000000000015','b0000004-0001-0000-0000-000000000015',1,'Flexbox y Grid',  2,2,true, NOW()-INTERVAL'10 days'),
  ('c0000004-0001-0002-0000-000000000015','b0000004-0001-0000-0000-000000000015',2,'CSS Variables',   2,1,false,NULL),
  ('c0000004-0002-0001-0000-000000000015','b0000004-0002-0000-0000-000000000015',1,'React Hooks',     3,0,false,NULL),
  ('c0000004-0002-0002-0000-000000000015','b0000004-0002-0000-0000-000000000015',2,'React Router',    2,0,false,NULL),
  -- Módulos Plan 18 (Arquitectura)
  ('c0000005-0001-0001-0000-000000000018','b0000005-0001-0000-0000-000000000018',1,'SOLID y Clean Arch',3,3,true,NOW()-INTERVAL'7 days'),
  ('c0000005-0001-0002-0000-000000000018','b0000005-0001-0000-0000-000000000018',2,'Hexagonal y CQRS',4,2,false,NULL),
  ('c0000005-0002-0001-0000-000000000018','b0000005-0002-0000-0000-000000000018',1,'API Gateway',     3,1,false,NULL),
  ('c0000005-0002-0002-0000-000000000018','b0000005-0002-0000-0000-000000000018',2,'Event Sourcing',  4,0,false,NULL)
ON CONFLICT (id) DO NOTHING;
