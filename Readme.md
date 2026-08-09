# PulseWatch

**Intelligent API Reliability & Incident Management Platform**

PulseWatch continuously monitors REST APIs, measures availability and latency, detects failures, records incidents, and visualizes system health through a real-time dashboard. It's a production-inspired full-stack project demonstrating backend engineering concepts: worker pools, retry strategies with exponential backoff, circuit breakers, and real-time systems via Socket.IO.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Deployment Instructions](#deployment-instructions)

---

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client, Recharts, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Socket.IO, node-cron, Helmet, Morgan, dotenv, express-validator, CORS

**DevOps:** Docker, Docker Compose

---

## Project Structure

```
pulsewatch/
├── backend/
│   ├── src/
│   │   ├── config/         # env config, DB connection
│   │   ├── middleware/     # auth, error handling, validation
│   │   ├── routes/         # Express route definitions
│   │   ├── controllers/    # HTTP request/response only
│   │   ├── services/       # business logic
│   │   ├── workers/        # monitorWorker, workerPool
│   │   ├── schedulers/     # node-cron scheduler
│   │   ├── models/         # Mongoose schemas
│   │   ├── socket/         # Socket.IO + internal event bus
│   │   └── utils/          # AppError, logger, request executor
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # route-level screens
│   │   ├── components/     # reusable UI
│   │   ├── layouts/        # sidebar/dashboard shell
│   │   ├── charts/         # Recharts components
│   │   ├── contexts/       # AuthContext
│   │   ├── hooks/          # useSocketEvent
│   │   └── services/       # Axios API calls
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Architecture Overview

```
React Dashboard  ->  Express API  ->  Monitoring Engine  ->  Worker Pool  ->  Target APIs
                          |                                     |
                     MongoDB  <--------------------------  Metrics / Incidents
                          |
                     Socket.IO  ->  Dashboard (live updates)
```

**Monitoring cycle:** a node-cron scheduler ticks every `SCHEDULER_TICK_MS`, finds APIs due for a check, and dispatches them across a bounded-concurrency worker pool. Each worker checks the circuit breaker, executes the HTTP request with exponential-backoff retries, stores a metric, updates the circuit breaker state, opens/resolves incidents as needed, and emits real-time events over an internal event bus that the Socket.IO layer forwards to connected clients.

**Note on the worker pool:** Node.js is single-threaded, so "workers" here means bounded-concurrency async execution (multiple in-flight HTTP requests at once), not OS-level threads — the correct approach for I/O-bound work like HTTP monitoring.

---

## Installation Guide

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string to a remote instance)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env if your MongoDB URI differs from the default
npm run start
```
Backend runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

Open `http://localhost:5173`, register an account, and add your first API to monitor.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/pulsewatch` |
| `JWT_SECRET` | Secret used to sign JWTs — **change in production** | — |
| `JWT_EXPIRES_IN` | JWT expiry | `7d` |
| `CLIENT_URL` | Frontend origin, used for CORS | `http://localhost:5173` |
| `DEFAULT_MONITOR_INTERVAL_MS` | Default per-API check interval | `60000` |
| `DEFAULT_REQUEST_TIMEOUT_MS` | Default per-request timeout | `10000` |
| `WORKER_POOL_SIZE` | Max concurrent in-flight checks | `4` |
| `SCHEDULER_TICK_MS` | How often the scheduler checks for due APIs | `5000` |
| `RETRY_MAX_ATTEMPTS` | Max attempts per check | `3` |
| `RETRY_BASE_DELAY_MS` | Base exponential backoff delay | `1000` |
| `CIRCUIT_FAILURE_THRESHOLD` | Consecutive failures before circuit opens | `5` |
| `CIRCUIT_COOLDOWN_MS` | Time before a probe request is allowed again | `30000` |
| `METRICS_RETENTION_DAYS` | TTL for raw metric documents | `30` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend REST API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend Socket.IO URL | `http://localhost:5000` |

---

## Running with Docker

From the project root:

```bash
docker compose up --build
```

This starts three containers: MongoDB, the backend (port `5000`), and the frontend served via nginx (port `5173`). Data persists in a named Docker volume (`mongo-data`) across restarts.

To set a custom JWT secret instead of the development default, create a `.env` file next to `docker-compose.yml`:
```
JWT_SECRET=your_long_random_production_secret
```

Stop everything with:
```bash
docker compose down
```
(add `-v` to also delete the MongoDB volume)

---

## API Documentation

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account, returns `{ user, token }` |
| POST | `/auth/login` | Log in, returns `{ user, token }` |
| GET | `/auth/profile` | Get the current user (protected) |

### APIs (protected, owner-scoped)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/apis` | List your monitored APIs |
| POST | `/apis` | Add a new API to monitor |
| GET | `/apis/:id` | Get one API |
| PUT | `/apis/:id` | Update an API |
| DELETE | `/apis/:id` | Delete an API |
| PATCH | `/apis/:id/toggle` | Enable/disable monitoring |

### Metrics (protected, owner-scoped)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/metrics?limit=` | Recent metrics across all your APIs |
| GET | `/metrics/:apiId?from=&to=&limit=` | Metrics for one API, defaults to most recent, optional date range |

### Incidents (protected, owner-scoped)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/incidents?status=` | List incidents, optional `active`/`resolved` filter |
| GET | `/incidents/:id` | Get one incident |

### Dashboard (protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Aggregated overview: total/healthy/failed APIs, active incidents, 24h avg latency/uptime |

### Socket.IO events (server to client)
`metrics:update`, `dashboard:update`, `incident:new`, `incident:resolved`, `api:statusChanged`

---

## Deployment Instructions

1. **Backend:** deploy the `backend/` folder to any Node.js host (Render, Railway, a VPS, etc.). Set all environment variables from the table above, pointing `MONGO_URI` at a production MongoDB instance (e.g. MongoDB Atlas). Ensure the host allows long-running background processes, since the scheduler runs continuously via `node-cron`.
2. **Frontend:** run `npm run build` inside `frontend/` to produce a static `dist/` folder, then deploy it to any static host (Vercel, Netlify, S3+CloudFront, or the provided nginx Docker image). Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend's public URL **before building** — Vite bakes these in at build time.
3. **CORS:** set the backend's `CLIENT_URL` to your deployed frontend's exact origin, or cross-origin requests will be blocked.
4. **Docker Compose** (above) is suitable for a single-VM deployment where all three services run together.