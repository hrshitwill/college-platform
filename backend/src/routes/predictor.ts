import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { exam, rank } = req.body;

        const result = await pool.query(
            `SELECT c.*, p.rank_min, p.rank_max
             FROM colleges c
             JOIN predictor p ON c.id = p.college_id
             WHERE p.exam = $1
             AND p.rank_min <= $2
             AND p.rank_max >= $2
             ORDER BY c.rating DESC`,
            [exam, Number(rank)]
        );

        res.json({ colleges: result.rows });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;