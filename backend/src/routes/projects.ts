import { Router } from 'express';
import { pool } from '../db';
import type { Project, Factor, Score, ProjectWithScores, CreateProjectInput } from '../types';

const router = Router();

// GET all projects with scores
router.get('/', async (req, res) => {
  try {
    const projectsResult = await pool.query<Project>(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );

    const projectsWithScores: ProjectWithScores[] = await Promise.all(
      projectsResult.rows.map(async (project) => {
        const scoresResult = await pool.query<Score & { factor: Factor }>(
          `SELECT s.*, 
                  json_build_object('id', f.id, 'name', f.name, 'consequence', f.consequence, 'created_at', f.created_at) as factor
           FROM scores s
           JOIN factors f ON s.factor_id = f.id
           WHERE s.project_id = $1`,
          [project.id]
        );
        
        const scores = scoresResult.rows.map(row => ({
          ...row,
          factor: row.factor as unknown as Factor
        }));
        
        return {
          ...project,
          scores
        };
      })
    );

    res.json(projectsWithScores);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const projectResult = await pool.query<Project>(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = projectResult.rows[0];

    const scoresResult = await pool.query<Score & { factor: Factor }>(
      `SELECT s.*, 
              json_build_object('id', f.id, 'name', f.name, 'consequence', f.consequence, 'created_at', f.created_at) as factor
       FROM scores s
       JOIN factors f ON s.factor_id = f.id
       WHERE s.project_id = $1`,
      [id]
    );

    const scores = scoresResult.rows.map(row => ({
      ...row,
      factor: row.factor as unknown as Factor
    }));

    const projectWithScores: ProjectWithScores = {
      ...project,
      scores,
    };

    res.json(projectWithScores);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// POST create project with scores
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { name, scores, overall_score } = req.body as CreateProjectInput;
    
    if (!name || !scores || !Array.isArray(scores)) {
      return res.status(400).json({ message: 'Name and scores are required' });
    }

    await client.query('BEGIN');

    // Create project
    const projectResult = await client.query<Project>(
      'INSERT INTO projects (name, overall_score) VALUES ($1, $2) RETURNING *',
      [name.trim(), overall_score]
    );
    const project = projectResult.rows[0];

    // Create scores
    for (const score of scores) {
      await client.query(
        'INSERT INTO scores (project_id, factor_id, probability) VALUES ($1, $2, $3)',
        [project.id, score.factor_id, score.probability]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(project);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  } finally {
    client.release();
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
