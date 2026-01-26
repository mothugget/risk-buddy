import { Router } from 'express';
import { pool } from '../db';
import type { Factor, CreateFactorInput, UpdateFactorInput } from '../types';

const router = Router();

// GET all factors
router.get('/', async (req, res) => {
  try {
    const result = await pool.query<Factor>(
      'SELECT * FROM factors ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching factors:', error);
    res.status(500).json({ message: 'Failed to fetch factors' });
  }
});

// POST create factor
router.post('/', async (req, res) => {
  try {
    const { name, weight } = req.body as CreateFactorInput;
    
    if (!name || typeof weight !== 'number') {
      return res.status(400).json({ message: 'Name and weight are required' });
    }

    const result = await pool.query<Factor>(
      'INSERT INTO factors (name, weight) VALUES ($1, $2) RETURNING *',
      [name.trim(), weight]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating factor:', error);
    res.status(500).json({ message: 'Failed to create factor' });
  }
});

// PUT update factor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight } = req.body as UpdateFactorInput;
    
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name.trim());
    }
    if (weight !== undefined) {
      updates.push(`weight = $${paramCount++}`);
      values.push(weight);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(id);
    const result = await pool.query<Factor>(
      `UPDATE factors SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Factor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating factor:', error);
    res.status(500).json({ message: 'Failed to update factor' });
  }
});

// DELETE factor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM factors WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Factor not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting factor:', error);
    res.status(500).json({ message: 'Failed to delete factor' });
  }
});

export default router;
