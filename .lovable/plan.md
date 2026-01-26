

## OSS Risk Scorer — Full Stack Application

A simple weighted risk scoring tool for evaluating open-source software projects, with a React frontend and Express backend.

---

### Architecture Overview

**Frontend (React + TypeScript)** — Built in Lovable
- Clean, minimal UI for managing factors and scoring projects
- Connects to Express API via REST endpoints
- Runs in browser

**Backend (Express + TypeScript)** — Code generated for you to run locally
- REST API for CRUD operations
- PostgreSQL database connection
- TypeScript throughout

---

### Database Schema

**factors** table
- `id` (UUID, primary key)
- `name` (text) — e.g., "Maintenance Activity"
- `weight` (numeric) — importance weight (will be normalized)
- `created_at` (timestamp)

**projects** table
- `id` (UUID, primary key)
- `name` (text) — project being evaluated
- `created_at` (timestamp)

**scores** table
- `id` (UUID, primary key)
- `project_id` (foreign key → projects)
- `factor_id` (foreign key → factors)
- `score` (integer, 0-100)

---

### Frontend Pages

**1. Factor Management**
- List all risk factors with their weights
- Add new factors (name + weight input)
- Edit/delete existing factors
- Visual indicator showing weight distribution

**2. New Assessment**
- Enter project name
- Score each factor using 0-100 slider/input
- Submit to calculate and save

**3. Results View**
- Overall weighted risk score (0-100)
- Breakdown table showing each factor's contribution
- Color-coded risk level indicator

**4. Project History**
- List of previously scored projects
- Click to view details
- Delete old assessments

---

### API Endpoints (Express)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/factors | List all factors |
| POST | /api/factors | Create new factor |
| PUT | /api/factors/:id | Update factor |
| DELETE | /api/factors/:id | Delete factor |
| GET | /api/projects | List all projects with scores |
| POST | /api/projects | Create project + scores |
| GET | /api/projects/:id | Get project details |
| DELETE | /api/projects/:id | Delete project |

---

### Deliverables

1. **React frontend** — fully functional UI built in Lovable
2. **Express backend code** — TypeScript files ready to run locally
3. **Database schema SQL** — migration script for PostgreSQL
4. **Setup instructions** — how to run the backend locally

