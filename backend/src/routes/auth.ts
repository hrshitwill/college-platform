import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

// Generate tokens
const generateTokens = (userId: number) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

// REGISTER
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Missing required fields'
                }
            });
        }

        // Check if user exists
        const existing = await pool.query(
            `SELECT id FROM users WHERE email = $1 OR username = $2`,
            [email, username]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                error: {
                    code: 'USER_EXISTS',
                    message: 'Email or username already registered'
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (username, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        const user = result.rows[0];
        const { accessToken, refreshToken } = generateTokens(user.id);

        res.status(201).json({
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Registration failed'
            }
        });
    }
});

// LOGIN
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Email and password required'
                }
            });
        }

        // Find user
        const result = await pool.query(
            `SELECT id, username, email, password
             FROM users WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }
            });
        }

        const user = result.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password'
                }
            });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);

        res.json({
            data: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Login failed'
            }
        });
    }
});

// REFRESH TOKEN
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_TOKEN',
                    message: 'Refresh token required'
                }
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as { userId: number };

        const { accessToken, refreshToken: newRefreshToken }
            = generateTokens(decoded.userId);

        res.json({
            tokens: {
                accessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (err) {
        res.status(401).json({
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid refresh token'
            }
        });
    }
});

// GET CURRENT USER
router.get('/me', async (req: any, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'No token provided'
                }
            });
        }

        const result = await pool.query(
            `SELECT id, username, email FROM users WHERE id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({ data: result.rows[0] });

    } catch (err) {
        res.status(500).json({
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to get user'
            }
        });
    }
});

export default router;