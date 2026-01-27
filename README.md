# Project Setup & Run Guide

This README walks you through setting up the development environment and running the app from scratch. It assumes you are on macOS or Linux. Windows users can follow the same steps using WSL2 or PowerShell equivalents.

---

## Prerequisites

Make sure the following are installed on your system:

* **Node.js** (v18+ recommended)
* **npm** (comes with Node.js)
* **PostgreSQL** (v14+ recommended)
* **Git**

You can verify installs with:

```bash
node -v
npm -v
psql --version
```

---

## 1. Create the Backend `.env` File

Navigate to the `backend` directory and create a `.env` file:

```bash
cd backend
touch .env
```

Add the following contents (replace `username` and `password` with your own values):

```env
DATABASE_URL=postgresql://username:password@localhost:5432/oss_risk_scorer
PORT=3001
```

⚠️ **Important:** PostgreSQL does not like capital letters in usernames or database names. Keep everything lowercase.

---

## 2. Install PostgreSQL

### macOS (Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

---

## 3. Connect to PostgreSQL

Log into the default PostgreSQL database:

```bash
psql postgres
```

If that fails, try:

```bash
psql -U postgres
```

---

## 4. Create Database and User

Inside the `psql` prompt, run the following commands (replace `username` and `password` to match your `.env` file):

```sql
CREATE USER username WITH PASSWORD 'password';

CREATE DATABASE oss_risk_scorer OWNER username;
```

---

## 5. Grant Full Permissions

Grant the user full access to the database and all tables:

```sql
GRANT ALL PRIVILEGES ON DATABASE oss_risk_scorer TO username;
```

Then connect to the database:

```sql
\c oss_risk_scorer
```

Grant permissions on existing and future tables:

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO username;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO username;
```

Exit psql:

```sql
\q
```

---

## 6. Load the Database Schema

From the project root or backend directory, run:

```bash
psql postgresql://username:password@localhost:5432/oss_risk_scorer \
  -f backend/schema.sql
```

This creates all required tables and schema.

---

## 7. Install Node Dependencies

### Install root dependencies

From the project root:

```bash
npm install
```

### Install backend dependencies

```bash
cd backend
npm install
```

---

## 8. Compile TypeScript (Backend)

Still in the `backend` directory:

```bash
npx tsc
```

This checks types and builds the backend.

---

## 9. Start the Backend Server

From the `backend` directory:

```bash
npx ts-node src/index.ts
```

The backend should now be running on:

```
http://localhost:3001
```

---

## 10. Start the Full App (Dev Mode)

Open a **new terminal window**, go to the project root, and run:

```bash
npm run dev
```

This starts the frontend (and any dev tooling) and connects it to the backend.

---

## 11. Common Issues

### Database connection errors

* Double-check `.env` values
* Make sure PostgreSQL is running
* Ensure username/database names are lowercase

### Permission errors

* Re-run the GRANT statements
* Verify the database owner is set correctly

### Port conflicts

* Make sure port `3001` is not already in use

---

## 12. You're Good to Go 🚀

If all steps completed successfully, the app should now be running locally with a connected PostgreSQL backend.

Happy hacking!

