# OSS Risk Scorer - Express Backend

This is the Express + TypeScript backend for the OSS Risk Scorer application.

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/oss_risk_scorer
PORT=3001
```

Replace `username`, `password`, and database name as needed.

### 3. Run database migrations

```bash
psql -d oss_risk_scorer -f schema.sql
```

Or run the SQL commands in `schema.sql` through your PostgreSQL client.

### 4. Start the server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

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

## Connecting the Frontend

The React frontend expects the API at `http://localhost:3001/api` by default.

To change this, set the `VITE_API_URL` environment variable in the frontend:

```env
VITE_API_URL=http://your-backend-url/api
```
