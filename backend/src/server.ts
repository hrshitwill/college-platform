import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import colleges  from './routes/colleges';
import predictor from './routes/predictor';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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