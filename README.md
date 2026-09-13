# AlgoForge

AlgoForge is a coding practice and assessment platform with a React frontend and a Java Spring Boot backend. It includes user authentication, problem browsing, admin management, code submission, sandboxed execution, and a leaderboard.

## Project structure

- `algoforge-frontend/` — Vite + React + TypeScript app
- `coding-platform-backend/` — Spring Boot REST API + PostgreSQL + Docker execution sandbox

## Tech stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Zustand + React Query
- Monaco editor support via `@monaco-editor/react`

### Backend
- Java 17
- Spring Boot 3.5
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway migrations
- Swagger / OpenAPI
- Docker-based code execution for Java, Python, C++, and JavaScript

## How the app works

1. The frontend loads the landing/login/register screens and routes users based on auth state.
2. When a user logs in, the backend returns a JWT token.
3. The frontend stores the token and sends it in the `Authorization: Bearer ...` header on every request.
4. Spring Security validates the token and protects protected/admin routes.
5. Problem and leaderboard pages fetch data from the backend.
6. When a user submits code, the backend stores the submission and runs it inside a Docker sandbox for secure, isolated execution.
7. Results are compared against expected outputs and stored for display in the submission detail page.

## Why these technologies were chosen

- React + Vite gives a fast developer experience and a modern SPA.
- Tailwind helps build a clean UI quickly without a heavy component library.
- Spring Boot reduces boilerplate for building secure, production-ready REST APIs.
- Spring Security + JWT provide stateless authentication for a web app.
- PostgreSQL is reliable for relational data such as users, problems, test cases, submissions, and leaderboard entries.
- Flyway keeps database schema updates controlled and repeatable.
- Docker is used for code execution because it gives isolation, resource limits, and runtime safety for untrusted user code.
- Swagger/OpenAPI makes the API easier to test and document.

## Backend setup

From the backend folder:

```powershell
cd coding-platform-backend
```

Start PostgreSQL with Docker:

```powershell
docker compose up -d postgres
```

Set environment variables:

```powershell
$env:DB_PASSWORD = "postgres"
$env:JWT_SECRET = "change-this-to-a-real-256-bit-secret"
$env:SPRING_PROFILES_ACTIVE = "demo" # local demo data and demo admin only
```

Run the backend:

```powershell
mvn spring-boot:run
```

Or build and run the JAR:

```powershell
mvn clean package -DskipTests
java -jar target/coding-platform-backend-0.1.0.jar
```

Backend URLs:

- API root: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI docs: `http://localhost:8080/v3/api-docs`

## Frontend setup

From the frontend folder:

```powershell
cd algoforge-frontend
npm install
```

Create a local environment file if needed:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Run the app:

```powershell
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Main backend API areas

- Auth: `/api/auth/register`, `/api/auth/login`
- Problems: `/api/problems`
- Test cases: `/api/problems/{problemId}/testcases`
- Submissions: `/api/submissions`
- Leaderboard: `/api/leaderboard`
- Dashboard: `/api/dashboard`
- User endpoints: `/api/users`, `/api/admin/users`

## REST API reference

Interactive documentation: `http://localhost:8080/swagger-ui.html`  
OpenAPI JSON: `http://localhost:8080/v3/api-docs`

The table below reflects endpoints implemented in this repository. An authenticated request uses `Authorization: Bearer <JWT>`.

| Area | Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- | --- |
| Auth | POST | `/api/auth/register` | Public | Register an account |
| Auth | POST | `/api/auth/login` | Public | Log in and receive a JWT |
| Problems | GET | `/api/problems?search=&difficulty=&page=&size=` | Public | Browse and filter problems |
| Problems | GET | `/api/problems/{id}` | Public | Read a problem and its visible test cases |
| Problems | POST/PUT/DELETE | `/api/problems`, `/api/problems/{id}` | Admin | Manage problems |
| Test cases | GET | `/api/problems/{id}/testcases` | Public | Read visible test cases |
| Test cases | GET/POST/PUT/DELETE | `/api/problems/{id}/testcases/all`, `/api/problems/{id}/testcases...` | Admin | Manage all test cases, including hidden ones |
| Submissions | POST | `/api/submissions` | Authenticated | Run (`sampleRunOnly: true`) or submit (`false`) source code |
| Submissions | GET | `/api/submissions/me`, `/api/submissions/{id}`, `/api/submissions/{id}/results` | Authenticated | Read personal submission history and verdict details |
| Submissions | GET | `/api/submissions/me/solved-problems` | Authenticated | Read solved problem IDs |
| Hints | GET | `/api/problems/{id}/hints`, `/api/problems/{id}/editorial` | Authenticated | Read hints and conditionally unlocked editorial |
| Users | GET | `/api/users/me`, `/api/users/me/dashboard` | Authenticated | Read current profile and dashboard statistics |
| Users | PUT | `/api/users/me/profile` | Authenticated | Update current profile |
| Leaderboard | GET | `/api/leaderboard` | Public | Read rankings |
| Dashboard | GET | `/api/dashboard`, `/api/dashboard/activity` | Authenticated | Read dashboard summary and activity |
| Challenges | GET | `/api/challenges/weekly` | Authenticated | Read the shared weekly challenge schedule |
| Challenges | PUT/DELETE | `/api/challenges/weekly/{dayOfWeek}` | Admin | Assign or clear a weekday challenge |
| Admin users | GET | `/api/admin/users` | Admin | Read platform user accounts |

### Planned API groups

`/api/intelligence`, `/api/notes`, `/api/bookmarks`, `/api/admin/metrics`, and `/api/admin/audit-logs` are product roadmap items, not implemented endpoints. They should not be advertised in public API documentation until their data model, authorization rules, and tests are implemented.

## Notes

- The backend reads the database URL from `application.yml`, which defaults to PostgreSQL on `localhost:5432` with database `coding_platform`.
- Docker execution is enabled by default via `execution.docker.enabled=true`.
- The frontend uses `http://localhost:8080` as its default backend URL if no environment variable is provided.
- If you want to run both together, start the backend first, then start the frontend in a separate terminal.

## Recommended local workflow

```powershell
# Terminal 1: backend
cd coding-platform-backend
docker compose up -d postgres
$env:DB_PASSWORD = "postgres"
$env:JWT_SECRET = "change-this-to-a-real-256-bit-secret"
$env:SPRING_PROFILES_ACTIVE = "demo"
mvn spring-boot:run

# Terminal 2: frontend
cd algoforge-frontend
npm install
npm run dev
```
