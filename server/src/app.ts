import cors from 'cors';
import express from 'express';
import studentRoutes from './routes/studentRoutes';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api', studentRoutes);

export default app;
