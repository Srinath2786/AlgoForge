# Coding Practice & Performance Assessment Platform — Backend

Spring Boot 3.5 / Java 17 backend for a LeetCode/HackerRank-style coding
practice platform: JWT auth, a problem bank with hidden/visible test cases,
a Docker-sandboxed code execution & judging engine (Java, Python, C++,
JavaScript), submission history, and a leaderboard.

This picks up from your Milestone-1 build (`com.platform`, `users` /
`problems` / `test_cases` / `submissions` tables already in Postgres) and
completes it into a full, coherent backend under `com.codingplatform`,
matching your project spec's Weeks 1–4 scope.

## Stack

- Java 17, Spring Boot 3.5.6
- Spring Security 6 + JWT (jjwt 0.12.6)
- Spring Data JPA + PostgreSQL 16, Flyway migrations
- springdoc-openapi (Swagger UI)
- Docker (ProcessBuilder-driven sandbox: `--network=none`, memory cap,
  1 CPU, read-only root fs, `--pids-limit`, auto-`--rm`)
- JUnit 5

## Project layout

```
src/main/java/com/codingplatform/
├── auth/            registration + login, JWT issuance
├── user/             profile + dashboard stats
├── problem/          problem bank CRUD + search
├── testcase/          visible/hidden test cases per problem
├── submission/        submit/run pipeline, per-test-case results
├── leaderboard/        score + rank aggregation
├── execution/          compile/run orchestration, output comparator
├── docker/             docker run command builder, process execution, cleanup
├── security/           JWT filter, UserDetailsService, SecurityConfig
├── config/              CORS, Swagger, bean config
├── exception/           custom exceptions + @RestControllerAdvice
└── common/              BaseEntity, Role, ApiResponse, Constants
```

## Running locally

**1. Database** — either point at your existing Postgres
(`CodingPlatform_InfoSys_SpringBoard`) or start one:

```bash
docker compose up -d postgres
```

Flyway's `V1__init_schema.sql` will create/validate the schema on boot
(baseline-on-migrate is on, so it's safe against your existing tables —
review the migration before first run since your DB already has data).

**2. Environment**

```bash
export DB_PASSWORD=postgres
export JWT_SECRET=change-this-to-a-real-256-bit-secret
```

**3. Run**

```bash
mvn spring-boot:run
# or, once packaged:
mvn clean package -DskipTests && java -jar target/coding-platform-backend-0.1.0.jar
```

API root: `http://localhost:8080/api` · Swagger UI: `http://localhost:8080/swagger-ui.html`

## Docker sandbox execution

`execution.docker.enabled=true` by default. The host running this service
needs a reachable Docker daemon (Docker Desktop locally, or the
Docker-outside-of-Docker socket mount already wired up in
`docker-compose.yml` if you containerize the backend itself). Each
submission:

1. gets a fresh temp directory (`DockerManager.createWorkDir`),
2. writes the source file into it,
3. compiles inside the container for Java/C++ (skipped for Python/JS),
4. runs the compiled program per test case with `stdin` piped in and a
   5-second wall-clock timeout,
5. is torn down (`ContainerCleanupService.cleanup`) whether it succeeds
   or throws.

Set `execution.docker.enabled=false` (or `DOCKER_EXECUTION_ENABLED=false`)
to boot the API without Docker for frontend/API-contract work — submissions
will still be evaluated but always come back as a stub `ACCEPTED`-shaped
empty result until Docker is available.

## What's implemented vs. what's next

Covers your spec's **Weeks 1–4**: auth, schema, sandboxed execution engine,
compilation-error handling, test-case evaluation with whitespace
normalization, problem/test-case CRUD (admin-only), submission lifecycle,
and the leaderboard (global; weekly/language-specific views are a
straightforward extension of `LeaderboardRepository`).

Not yet built (Weeks 3–6 stretch items, intentionally left out to keep this
delivery honest): hints/editorial unlock system, weekly & per-language
leaderboard views, and everything on the React side (Monaco editor,
problem browser, dashboard UI — that's your AlgoForge frontend).

## Tests

```bash
mvn test
```

Includes `OutputComparatorTest` (whitespace-normalization judging logic)
and a Spring context-load smoke test against H2 (`application-test.yml`).
Docker-dependent execution paths aren't unit-tested here since this
sandbox has no Docker daemon or Maven-Central network access — add
Testcontainers-based integration tests once you're running this with
Docker available, covering: valid code → correct output, infinite loop →
timeout, memory-exceeded → OOM, and a malicious syscall attempt → sandbox
isolation, per your spec's Week 1–2 checklist.

## Known gaps / honest disclosures

- I could not run `mvn` in this environment (no Maven Central network
  access here), so this hasn't been compiled — review it in your IDE
  before treating it as final. The code follows Spring Boot 3.5 /
  Jakarta EE 10 APIs throughout (matches your existing pom.xml).
- The Flyway migration assumes a fresh database. Your existing DB already
  has `users`/`problems`/`test_cases`/`submissions`/`leaderboard`/
  `leaderboard_entries` tables from Milestone 1 with a slightly different
  shape (a `roles`/`user_roles` join-table pair alongside a `role` column
  on `users`, an extra unused `leaderboard` table). This migration
  supersedes that with a single `role` enum column and one
  `leaderboard_entries` table — back up your data and adjust the
  migration (or point Flyway at a fresh schema) rather than running it
  blind against the existing one.
- CORS defaults to `localhost:3000` / `localhost:5173` (your AlgoForge
  Next.js dev ports) via `app.cors.allowed-origins`.














Reviewing project run instructions and current startup config so I can give you exact commands.

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/pom.xml#1-1), lines 1 to 120

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/README.md)

## What this project is

This is a Java Spring Boot backend for a coding practice platform:
- JWT auth + registration/login
- problem bank + test cases
- submission evaluation via Docker sandbox
- leaderboard + user stats
- PostgreSQL persistence
- Swagger API docs

It is the backend service only, not the frontend.

---

## How to run it locally

### 1) Start PostgreSQL
From PowerShell in the project folder:
```powershell
docker compose up -d postgres
```

### 2) Set required environment variables
In PowerShell:
```powershell
$env:DB_PASSWORD = "postgres"
$env:JWT_SECRET = "change-this-to-a-real-256-bit-secret"
```

If you need more DB vars, check `application.yml` and `application-test.yml`. The default setup uses:
- `spring.datasource.username=postgres`
- `spring.datasource.password` from `DB_PASSWORD`

### 3) Run the app
From the project root:
```powershell
mvn spring-boot:run
```

Or build and run the jar:
```powershell
mvn clean package -DskipTests
java -jar target/coding-platform-backend-0.1.0.jar
```

---

## How to test it

Run unit tests with:
```powershell
mvn test
```

This uses the `test` profile and H2 in-memory DB, not PostgreSQL.

---

## API URLs

When the app is running on `localhost:8080`:

- API root: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## Quick summary

1. `docker compose up -d postgres`
2. Set `DB_PASSWORD` and `JWT_SECRET`
3. `mvn spring-boot:run`
4. Open Swagger at `http://localhost:8080/swagger-ui.html`

If you want, I can also check the exact `application.yml` database settings and confirm the Postgres connection string.




next 

Scanning controller classes for API endpoints and Swagger-exposed routes.

Searched for regex `@RestController|@Controller|@RequestMapping|@GetMapping|@PostMapping|@PutMapping|@DeleteMapping` (`**/src/main/java/com/codingplatform/**/*.java`), 28 results

Gathering the controller endpoint definitions so I can list the Swagger APIs exactly.

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/auth/controller/AuthController.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/leaderboard/controller/LeaderboardController.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/problem/controller/ProblemController.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/submission/controller/SubmissionController.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/testcase/controller/TestCaseController.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/user/controller/UserController.java)

## Swagger APIs available in this backend

These endpoints are exposed by Swagger/OpenAPI under `http://localhost:8080/swagger-ui.html`:

### Auth
- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — login and get JWT token

### Users
- `GET /api/users` — list all users
- `GET /api/users/me` — current user profile
- `GET /api/users/me/dashboard` — current user dashboard stats

### Problems
- `GET /api/problems` — search/browse problems
- `GET /api/problems/{id}` — get problem details
- `POST /api/problems` — create a problem (admin only)
- `PUT /api/problems/{id}` — update a problem (admin only)
- `DELETE /api/problems/{id}` — delete a problem (admin only)

### Test Cases
- `GET /api/problems/{problemId}/testcases` — get visible/sample test cases for a problem

### Submissions
- `POST /api/submissions` — submit code for evaluation
- `GET /api/submissions/{id}` — get one submission by id
- `GET /api/submissions/me` — get current user’s submissions

### Leaderboard
- `GET /api/leaderboard` — get platform leaderboard page

---

## How to see them in Swagger

Start the app, then open:

- `http://localhost:8080/swagger-ui.html`

Swagger will show:
- the above API groups
- request/response DTO fields
- security/auth headers if JWT is configured

If you want, I can also list the exact request body fields for each endpoint.




next 

Checking backend configuration and CORS settings so I can explain exact database and frontend connection details.

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/resources/application.yml)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/java/com/codingplatform/config/CorsConfig.java)

Read [](file:///c%3A/Users/SRINATH%20M/Documents/coding-platform-backend/src/main/resources/application-test.yml)

## How the project runs

This backend is a Spring Boot application. It runs on port `8080` and exposes APIs under `/api/*`.

### Start the database
Use Docker Compose to start PostgreSQL:
```powershell
docker compose up -d postgres
```

### Set required environment variables
In PowerShell:
```powershell
$env:DB_PASSWORD = "postgres"
$env:JWT_SECRET = "change-this-to-a-real-256-bit-secret"
```

### Run the backend
From the project root:
```powershell
mvn spring-boot:run
```

Or build and run the jar:
```powershell
mvn clean package -DskipTests
java -jar target/coding-platform-backend-0.1.0.jar
```

---

## How the backend connects to the database

The runtime config is in application.yml.

Default database connection:
- URL: `jdbc:postgresql://localhost:5432/CodingPlatform_InfoSys_SpringBoard`
- Username: `postgres`
- Password: from `DB_PASSWORD` env var
- Flyway migrations enabled on startup

So the backend uses PostgreSQL in normal run mode.

> Note: application-test.yml is only for tests. It uses H2 in-memory DB and is not the runtime database config.

---

## How the backend connects to the frontend

The backend allows browser requests from:
- `http://localhost:3000`
- `http://localhost:5173`

This comes from CorsConfig.java, so if your frontend runs on one of those ports, it can call the backend.

### Frontend base URL
Use this for all API calls:
- `http://localhost:8080/api`

### Example frontend flow
1. `POST /api/auth/login` with email/password
2. Receive JWT token
3. Send requests with header:
   - `Authorization: Bearer <token>`

---

## What the frontend can use

Your frontend should call these backend routes:
- Auth: `/api/auth/register`, `/api/auth/login`
- Users: `/api/users`, `/api/users/me`, `/api/users/me/dashboard`
- Problems: `/api/problems`, `/api/problems/{id}`
- Test cases: `/api/problems/{problemId}/testcases`
- Submissions: `/api/submissions`, `/api/submissions/{id}`, `/api/submissions/me`
- Leaderboard: `/api/leaderboard`

---

## Swagger and API testing

After backend starts, open:
- `http://localhost:8080/swagger-ui.html`

Swagger shows all available endpoints and request/response models.

---

## Summary for your project

1. Start PostgreSQL: `docker compose up -d postgres`
2. Set `DB_PASSWORD` and `JWT_SECRET`
3. Run backend: `mvn spring-boot:run`
4. Frontend should call `http://localhost:8080/api`
5. Use JWT token in `Authorization: Bearer ...`
6. Swagger UI: `http://localhost:8080/swagger-ui.html`

If you want, I can also tell you the exact request body for login, register, and submission APIs.


cd "C:\Users\SRINATH M\Documents\coding-platform-backend"
$env:DB_PASSWORD="postgres"
mvn spring-boot:run

$env:DB_PASSWORD="postgres"
mvn spring-boot:run




```powershell
cd "C:\Users\SRINATH M\Documents\coding-platform-backend"
$env:DB_PASSWORD="postgres"
mvn spring-boot:run
```

If you are using Docker for PostgreSQL, run this first:

```powershell
docker compose up -d postgres
```

Then run:

```powershell
$env:DB_PASSWORD="postgres"
mvn spring-boot:run
```

Once it starts, open:

- http://localhost:8080
- http://localhost:8080/swagger-ui.html
- http://localhost:8080/v3/api-docs

If your local PostgreSQL password is not postgres, replace it with your real password.


cd "C:\Users\SRINATH M\Documents\coding-platform-backend"
$env:DB_PASSWORD='1234'
mvn spring-boot:run

## Yes — the backend is working

- Backend is running on: `http://localhost:8080`
- Swagger UI is available at: `http://localhost:8080/swagger-ui/index.html`
- API docs are available at: `http://localhost:8080/v3/api-docs`

> The root path `/` returns `401`, which is normal for this app because that endpoint requires authentication.