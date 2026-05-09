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
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://college-platform.vercel.app',
        process.env.FRONTEND_URL
    ],
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