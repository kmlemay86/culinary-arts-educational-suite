import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import moduleRoutes from './routes/modules';
import lessonRoutes from './routes/lessons';
import quizRoutes from './routes/quizzes';
import recipeRoutes from './routes/recipes';
import gameRoutes from './routes/games';
import progressRoutes from './routes/progress';
import badgeRoutes from './routes/badges';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());
app.use(cookieParser());

// CSRF mitigation: verify Origin header for state-changing requests that rely on cookie auth
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    // Requests using Authorization header are immune to CSRF
    if (req.headers.authorization) {
      return next();
    }
    const origin = req.headers.origin;
    const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
    // Only enforce for browser requests that send an Origin header
    if (origin && origin !== allowedOrigin) {
      res.status(403).json({ success: false, error: 'CSRF check failed' });
      return;
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

export default app;
