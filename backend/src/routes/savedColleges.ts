import { Router } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Save college to wishlist
router.post('/:collegeId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { collegeId } = req.params;
        const userId = req.userId;

        const result = await pool.query(
            `INSERT INTO saved_colleges (user_id, college_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING
             RETURNING id`,
            [userId, collegeId]
        );

        res.status(201).json({
            data: { saved: true }
        });

    } catch (err) {
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to save college'
            }
        });
    }
});

// Get user's saved colleges
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const result = await pool.query(
            `SELECT c.* FROM colleges c
             INNER JOIN saved_colleges sc ON c.id = sc.college_id
             WHERE sc.user_id = $1
             ORDER BY sc.created_at DESC`,
            [req.userId]
        );

        res.json({ data: result.rows });

    } catch (err) {
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to fetch saved colleges'
            }
        });
    }
});

// Remove from saved
router.delete('/:collegeId', authMiddleware, async (req: AuthRequest, res) => {
    try {
        await pool.query(
            `DELETE FROM saved_colleges
             WHERE user_id = $1 AND college_id = $2`,
            [req.userId, req.params.collegeId]
        );

        res.json({ data: { deleted: true } });

    } catch (err) {
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to remove college'
            }
        });
    }
});

export default router;