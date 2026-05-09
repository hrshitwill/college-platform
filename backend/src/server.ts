import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import colleges  from './routes/colleges';
import predictor from './routes/predictor';
import auth from './routes/auth';
import savedColleges from './routes/savedColleges';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://college-platform-xi.vercel.app',
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/saved-colleges', savedColleges);

// routes
app.use('/api/colleges',  colleges);
app.use('/api/predictor', predictor);

// test route
app.get('/', (req, res) => {
    res.json({ message: 'College Platform API Running 🚀' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT} 🚀`)
);