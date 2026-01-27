-- OSS Risk Scorer Database Schema
-- Run this against your PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Factors table
CREATE TABLE IF NOT EXISTS factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    consequence NUMERIC NOT NULL DEFAULT 1 CHECK (consequence >= 1 AND consequence <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    overall_score NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    factor_id UUID NOT NULL REFERENCES factors(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, factor_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scores_project_id ON scores(project_id);
CREATE INDEX IF NOT EXISTS idx_scores_factor_id ON scores(factor_id);

-- Sample factors (optional - remove if you want to start fresh)
-- INSERT INTO factors (name, consequence) VALUES
--     ('Maintenance Activity', 25),
--     ('Community Size', 20),
--     ('Security History', 30),
--     ('Documentation Quality', 15),
--     ('License Compatibility', 10);
