<div align="center">

# 🎯 Enfoca
### Plataforma de Productividad Académica con Certificación Verificable

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![AWS](https://img.shields.io/badge/AWS-EC2_us--east--2-orange?logo=amazonaws)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/Licencia-MIT-green)](LICENSE)

**[🌐 enfoca.online](https://enfoca.online)** · Proyecto de Título · Ingeniería en Informática · Duoc UC · 2026

</div>

---

## ¿Qué es Enfoca?

Enfoca es una plataforma web orientada a estudiantes universitarios y autodidactas que combina tres pilares funcionales:

- **📚 Planes de estudio con IA** — Groq (Llama 3.3 70B) genera planes estructurados con módulos, temas y estimaciones de tiempo. El sistema los auto-indexa y los congela cuando alcanzan ≥90% de aprobación comunitaria.
- **⏱️ Pomodoro avanzado** — Sesiones de 25/40/50 min con música ambiental, modo Deep Focus y persistencia de estado en Redis (el temporizador sobrevive recargas de página).
- **🏆 Gamificación y certificación** — XP, niveles, insignias desbloqueables, rachas de actividad, exámenes evaluados por IA, certificados PDF con QR verificable y Open Badges (Badgr) compartibles en LinkedIn.

---

## Arquitectura

El sistema implementa una arquitectura de **8 microservicios** con Spring Boot 3 + Spring Cloud, patrón Database-per-Service, Circuit Breakers (Resilience4j), mensajería asíncrona (RabbitMQ) y API Gateway con BFF.


---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3.4, shadcn/ui, Recharts, Axios |
| **Backend** | Java 21, Spring Boot 3.3, Spring Cloud Gateway, Netflix Eureka |
| **Seguridad** | Spring Security, JWT (HMAC-SHA256), Resilience4j Circuit Breaker |
| **Bases de datos** | PostgreSQL 15 (Supabase), Redis 7 (Upstash) |
| **Mensajería** | RabbitMQ 3 |
| **IA** | Groq Llama 3.3 70B (principal) + Google Gemini 1.5 Flash (fallback) |
| **Infraestructura** | AWS EC2 (t3.micro/t3.small), VPC, NAT Gateway, S3, Secrets Manager |
| **DevOps** | Docker Compose, GitHub Actions, Flyway, CloudWatch |
| **Certificación** | Badgr API (Open Badges 2.0), PDF con QR verificable |

---

## Estructura del Repositorio


---

## Levantamiento Local (Docker Compose)

### Prerrequisitos

- Docker Desktop 4.x o superior
- Git
- Claves de API: Groq y Google Gemini (Free Tier)
- Java 21 + Maven (solo si compilas sin Docker)

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/KeitonChaves/enfoca.git
cd enfoca/EnfocaProyect
```

**2. Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con los valores reales:

```env
# JWT — mismo valor en auth-service y api-gateway
JWT_SECRET_KEY=tu_clave_secreta_minimo_32_caracteres

# IA
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...

# Redis (local Docker no requiere contraseña)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
```

**3. Levantar todos los servicios**
```bash
docker compose up --build
```

> ⏳ El primer build toma ~5–8 minutos. Los servicios arrancan en orden gracias a los `healthchecks`.

**4. Verificar que todo está corriendo**

| Servicio | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Swagger Auth | http://localhost:8081/swagger-ui.html |
| Swagger Pomodoro | http://localhost:8082/swagger-ui.html |
| Swagger AI | http://localhost:8085/swagger-ui.html |

---

## Ejecutar Pruebas

### Backend (JUnit + MockMvc)
```bash
# Todos los tests del backend
cd EnfocaProyect
mvn test

# Por microservicio específico
mvn test -pl auth-service
mvn test -pl metrics-service
mvn test -pl api-gateway
```

### Frontend (Vitest + React Testing Library)
```bash
cd EnfocaProyect/EnfocaFront
npm ci
npm test
```

**Cobertura de pruebas confirmada:**
- `LoginPage` — 18/18 PASS
- `RegisterPage` — 20/20 PASS  
- `AuthContext` — 13/13 PASS
- `JwtServiceTest` — 8/8 PASS
- `JwtAuthFilterTest` (metrics) — 5/5 PASS
- Gateway 401 token inválido — PASS

---

## Flujo de Certificación

---

## Despliegue en Producción (AWS)

La arquitectura de producción corre en **AWS us-east-2 (Ohio)**:

- **EC2 #1** (t3.micro, subred pública): Nginx + React SPA build
- **EC2 #2** (t3.micro, subred privada): Spring Cloud Gateway + Eureka
- **EC2 #3** (t3.small, subred privada): Todos los microservicios + RabbitMQ + Redis
- **Supabase** (Free Tier): PostgreSQL de producción para todos los servicios
- **Cloudflare** (Free): CDN + WAF + SSL Full Strict + DNS para `enfoca.online`

Para reproducir el despliegue, ver los scripts en `EnfocaProyect/scripts/`.

---

## Equipo

| Integrante | Rol |
|---|---|
| **Keiton Chávez** | Backend — Microservicios Spring Boot (auth, métricas, gamificación, certificación) |
| **Dario Morales** | Frontend — Aplicación React completa |
| **Felipe Ulloa** | DevOps / IA — Infraestructura AWS, API Gateway, integración IA, despliegue |

---

<div align="center">

Proyecto de Título · Duoc UC · Ingeniería en Informática · 2026

</div>
