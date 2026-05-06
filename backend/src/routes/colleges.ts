import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET all colleges with search + filter
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            search,
            location,
            fees_max,
            page  = 1,
            limit = 9
        } = req.query;

        let query  = `SELECT * FROM colleges WHERE 1=1`;
        let params: any[] = [];
        let count  = 1;

        if (search) {
            query += ` AND name ILIKE $${count++}`;
            params.push(`%${search}%`);
        }

        if (location) {
            query += ` AND state = $${count++}`;
            params.push(location);
        }

        if (fees_max) {
            query += ` AND fees_max <= $${count++}`;
            params.push(fees_max);
        }

        const offset = (Number(page) - 1) * Number(limit);
        query += ` ORDER BY rating DESC
                   LIMIT $${count++}
                   OFFSET $${count++}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);
        res.json({ colleges: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ compare BEFORE /:id
router.post('/compare', async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;

        const result = await pool.query(
            `SELECT * FROM colleges
             WHERE id = ANY($1::int[])`,
            [ids]
        );

        res.json({ colleges: result.rows });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single college ← AFTER compare!
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const college = await pool.query(
            `SELECT * FROM colleges WHERE id = $1`, [id]
        );

        const courses = await pool.query(
            `SELECT * FROM courses WHERE college_id = $1`, [id]
        );

        res.json({
            college: college.rows[0],
            courses: courses.rows
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;