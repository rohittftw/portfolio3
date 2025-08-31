import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import AdminRoutes from "../routes/AdminRoutes";
import { metricsMiddleware, portfolioMetrics } from "../middleware/metrics";
import AnalyticsRoutes from "../routes/AnalyticsRoutes";
import BlogRoutes from "../routes/BlogRoutes";
import ProjectRoutes from "../routes/ProjectRoutes";

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://rohitdhawadkar.in',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

// Use the cors middleware (this handles OPTIONS automatically)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));

// Parse JSON bodies
app.use(express.json());

// Add metrics middleware
app.use(metricsMiddleware);

// Routes
app.get("/metrics", (req: Request, res: Response) => {
  try {
    res.json(portfolioMetrics.getMetrics());
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

app.use("/api/admin", AdminRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/projects", ProjectRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
