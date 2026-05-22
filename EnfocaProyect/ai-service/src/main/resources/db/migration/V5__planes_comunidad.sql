-- Planes de estudio comunitarios transversales, ya congelados con alta valoración
-- usuario_id 'comunidad' identifica planes curados del sistema

DO $$
DECLARE
    p1  UUID; p2  UUID; p3  UUID; p4  UUID; p5  UUID;
    p6  UUID; p7  UUID; p8  UUID; p9  UUID; p10 UUID;
    m   UUID;
BEGIN

-- ══════════════════════════════════════════════
-- 1. Python para Principiantes (BASICO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Python para Principiantes', 'Dominar los fundamentos de Python para resolver problemas reales con código limpio y eficiente.', 'BASICO', 'CONGELADO', 0.96, 52, '#8b5cf6')
RETURNING id INTO p1;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p1, 1, 'Fundamentos del Lenguaje') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Variables, tipos de datos y operadores', 2),
    (m, 2, 'Estructuras de control: if, for, while', 2),
    (m, 3, 'Funciones y parámetros', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p1, 2, 'Estructuras de Datos Básicas') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Listas, tuplas y conjuntos', 2),
    (m, 2, 'Diccionarios y comprensiones de listas', 2),
    (m, 3, 'Manejo de cadenas de texto', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p1, 3, 'Programación Orientada a Objetos') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Clases y objetos', 3),
    (m, 2, 'Herencia y polimorfismo', 3),
    (m, 3, 'Manejo de excepciones y módulos', 2);

-- ══════════════════════════════════════════════
-- 2. Estadística Aplicada (BASICO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Estadística Aplicada', 'Comprender y aplicar conceptos estadísticos esenciales para análisis de datos y toma de decisiones.', 'BASICO', 'CONGELADO', 0.94, 48, '#06b6d4')
RETURNING id INTO p2;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p2, 1, 'Estadística Descriptiva') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Media, mediana y moda', 2),
    (m, 2, 'Varianza y desviación estándar', 2),
    (m, 3, 'Distribuciones de frecuencia y gráficos', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p2, 2, 'Probabilidad') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Conceptos básicos de probabilidad', 2),
    (m, 2, 'Distribuciones binomial y normal', 3),
    (m, 3, 'Teorema de Bayes', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p2, 3, 'Inferencia Estadística') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Intervalos de confianza', 3),
    (m, 2, 'Pruebas de hipótesis', 3),
    (m, 3, 'Correlación y regresión lineal simple', 3);

-- ══════════════════════════════════════════════
-- 3. Inglés para Negocios (BASICO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Inglés para Negocios', 'Desarrollar habilidades comunicativas en inglés enfocadas al entorno profesional y corporativo.', 'BASICO', 'CONGELADO', 0.95, 61, '#10b981')
RETURNING id INTO p3;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p3, 1, 'Comunicación Escrita') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Redacción de emails profesionales', 2),
    (m, 2, 'Informes y resúmenes ejecutivos', 3),
    (m, 3, 'Vocabulario de negocios esencial', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p3, 2, 'Comunicación Oral') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Presentaciones y pitches en inglés', 3),
    (m, 2, 'Reuniones y negociaciones', 2),
    (m, 3, 'Frases y expresiones idiomáticas de negocios', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p3, 3, 'Gramática Aplicada') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Tiempos verbales en contexto profesional', 2),
    (m, 2, 'Condicionales y subjuntivo en negocios', 2),
    (m, 3, 'Voz pasiva y estilo formal', 2);

-- ══════════════════════════════════════════════
-- 4. Bases de Datos con SQL (BASICO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Bases de Datos con SQL', 'Diseñar, consultar y optimizar bases de datos relacionales usando SQL estándar.', 'BASICO', 'CONGELADO', 0.97, 55, '#f59e0b')
RETURNING id INTO p4;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p4, 1, 'Fundamentos Relacionales') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Modelo entidad-relación y normalización', 3),
    (m, 2, 'Creación de tablas y tipos de datos', 2),
    (m, 3, 'Claves primarias, foráneas y restricciones', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p4, 2, 'Consultas SQL') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'SELECT, WHERE, ORDER BY y LIMIT', 2),
    (m, 2, 'JOINs: INNER, LEFT, RIGHT y FULL', 3),
    (m, 3, 'Funciones de agregación y GROUP BY', 2),
    (m, 4, 'Subconsultas y CTEs', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p4, 3, 'Optimización y Administración') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Índices y planes de ejecución', 3),
    (m, 2, 'Transacciones y control de concurrencia', 3),
    (m, 3, 'Vistas, procedimientos almacenados y triggers', 3);

-- ══════════════════════════════════════════════
-- 5. Gestión de Proyectos Ágiles (BASICO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Gestión de Proyectos Ágiles', 'Liderar equipos y proyectos usando metodologías ágiles como Scrum y Kanban de forma efectiva.', 'BASICO', 'CONGELADO', 0.93, 44, '#ec4899')
RETURNING id INTO p5;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p5, 1, 'Fundamentos Ágiles') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Manifiesto ágil y sus 12 principios', 2),
    (m, 2, 'Diferencias entre metodologías ágiles y tradicionales', 2),
    (m, 3, 'Roles, artefactos y eventos en Scrum', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p5, 2, 'Scrum en Profundidad') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Sprint planning y backlog refinement', 2),
    (m, 2, 'Daily standup y métricas de velocidad', 2),
    (m, 3, 'Sprint review y retrospectiva efectiva', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p5, 3, 'Kanban y Herramientas') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Tableros Kanban y límites de WIP', 2),
    (m, 2, 'Jira, Trello y GitHub Projects', 2),
    (m, 3, 'OKRs y métricas de equipo', 2);

-- ══════════════════════════════════════════════
-- 6. Desarrollo Web con React (INTERMEDIO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Desarrollo Web con React', 'Construir aplicaciones web modernas y escalables usando React 18 y su ecosistema actual.', 'INTERMEDIO', 'CONGELADO', 0.95, 58, '#8b5cf6')
RETURNING id INTO p6;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p6, 1, 'Fundamentos de React') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'JSX, componentes y props', 2),
    (m, 2, 'Estado con useState y efectos con useEffect', 3),
    (m, 3, 'Renderizado condicional y listas', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p6, 2, 'Hooks y Gestión de Estado') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'useContext y Context API', 3),
    (m, 2, 'useReducer para estado complejo', 3),
    (m, 3, 'Custom hooks y patrones de composición', 3),
    (m, 4, 'Zustand o Redux Toolkit', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p6, 3, 'Ecosistema y Buenas Prácticas') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'React Router v6 y navegación', 2),
    (m, 2, 'Fetching de datos con React Query', 3),
    (m, 3, 'Testing con Vitest y Testing Library', 3),
    (m, 4, 'Performance: memo, useMemo, useCallback', 3);

-- ══════════════════════════════════════════════
-- 7. Machine Learning Aplicado (INTERMEDIO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Machine Learning Aplicado', 'Implementar modelos de machine learning supervisado y no supervisado para resolver problemas reales.', 'INTERMEDIO', 'CONGELADO', 0.94, 62, '#06b6d4')
RETURNING id INTO p7;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p7, 1, 'Fundamentos Matemáticos') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Álgebra lineal para ML: vectores y matrices', 3),
    (m, 2, 'Cálculo y gradiente descendente', 3),
    (m, 3, 'Probabilidad bayesiana aplicada a ML', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p7, 2, 'Aprendizaje Supervisado') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Regresión lineal y logística', 3),
    (m, 2, 'Árboles de decisión y Random Forest', 3),
    (m, 3, 'Support Vector Machines', 3),
    (m, 4, 'Evaluación de modelos: métricas y cross-validation', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p7, 3, 'Aprendizaje No Supervisado') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Clustering con K-Means y DBSCAN', 3),
    (m, 2, 'Reducción de dimensionalidad: PCA', 3),
    (m, 3, 'Detección de anomalías', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p7, 4, 'Pipelines y Producción') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Preprocesamiento con scikit-learn Pipelines', 3),
    (m, 2, 'Hyperparameter tuning con GridSearch', 2),
    (m, 3, 'Despliegue de modelos con FastAPI', 3);

-- ══════════════════════════════════════════════
-- 8. Algoritmos y Estructuras de Datos (INTERMEDIO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Algoritmos y Estructuras de Datos', 'Dominar las estructuras de datos clásicas y el análisis de complejidad para superar entrevistas técnicas.', 'INTERMEDIO', 'CONGELADO', 0.96, 70, '#f59e0b')
RETURNING id INTO p8;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p8, 1, 'Complejidad y Arrays') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Notación Big-O: tiempo y espacio', 2),
    (m, 2, 'Arrays, strings y técnica de dos punteros', 3),
    (m, 3, 'Sliding window y búsqueda binaria', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p8, 2, 'Estructuras Lineales') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Pilas y colas: implementación y aplicaciones', 2),
    (m, 2, 'Listas enlazadas simples y dobles', 3),
    (m, 3, 'Tablas hash y resolución de colisiones', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p8, 3, 'Estructuras No Lineales') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Árboles binarios y BST', 3),
    (m, 2, 'Heap y Priority Queue', 3),
    (m, 3, 'Grafos: BFS, DFS y caminos más cortos', 4);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p8, 4, 'Técnicas Avanzadas') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Recursión y backtracking', 3),
    (m, 2, 'Programación dinámica: memoización y tabulation', 4),
    (m, 3, 'Algoritmos greedy', 3);

-- ══════════════════════════════════════════════
-- 9. Ciberseguridad: Fundamentos (INTERMEDIO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Ciberseguridad: Fundamentos', 'Comprender los principios de seguridad informática, amenazas comunes y mecanismos de defensa básicos.', 'INTERMEDIO', 'CONGELADO', 0.93, 47, '#ef4444')
RETURNING id INTO p9;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p9, 1, 'Conceptos Base') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Tríada CIA: confidencialidad, integridad, disponibilidad', 2),
    (m, 2, 'Tipos de activos y superficies de ataque', 2),
    (m, 3, 'Criptografía simétrica y asimétrica', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p9, 2, 'Amenazas y Vectores de Ataque') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'OWASP Top 10: inyecciones y XSS', 3),
    (m, 2, 'Ingeniería social y phishing', 2),
    (m, 3, 'Malware: tipos, propagación y análisis básico', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p9, 3, 'Defensa y Respuesta') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Firewalls, IDS/IPS y segmentación de red', 3),
    (m, 2, 'Hardening de sistemas y gestión de parches', 2),
    (m, 3, 'Respuesta a incidentes y análisis forense básico', 3);

-- ══════════════════════════════════════════════
-- 10. Cálculo Diferencial e Integral (AVANZADO)
-- ══════════════════════════════════════════════
INSERT INTO planes.plan_estudio (usuario_id, titulo, objetivo, nivel, estado, ratio_validaciones, total_validaciones, color)
VALUES ('comunidad', 'Cálculo Diferencial e Integral', 'Dominar los conceptos del cálculo para aplicarlos en ingeniería, física y ciencias de datos.', 'AVANZADO', 'CONGELADO', 0.91, 53, '#a855f7')
RETURNING id INTO p10;

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p10, 1, 'Límites y Continuidad') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Concepto intuitivo y formal de límite', 3),
    (m, 2, 'Límites laterales e indeterminaciones', 3),
    (m, 3, 'Continuidad y discontinuidades', 2);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p10, 2, 'Derivadas') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Definición y reglas de derivación', 3),
    (m, 2, 'Regla de la cadena y derivadas implícitas', 3),
    (m, 3, 'Aplicaciones: optimización y regla de L''Hôpital', 3),
    (m, 4, 'Derivadas de orden superior y series de Taylor', 4);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p10, 3, 'Integrales') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Integral indefinida y técnicas de integración', 3),
    (m, 2, 'Integral definida y Teorema Fundamental del Cálculo', 3),
    (m, 3, 'Integración por partes y por sustitución trigonométrica', 4),
    (m, 4, 'Aplicaciones: áreas, volúmenes y trabajo', 3);

INSERT INTO planes.modulo (plan_id, orden, titulo) VALUES (p10, 4, 'Cálculo Multivariable Introductorio') RETURNING id INTO m;
INSERT INTO planes.tema (modulo_id, orden, titulo, pomodoros_estimados) VALUES
    (m, 1, 'Funciones de varias variables y superficies', 3),
    (m, 2, 'Derivadas parciales y gradiente', 3),
    (m, 3, 'Integrales dobles y aplicaciones', 4);

END $$;
