import express, { Request, Response } from "express";
import AdminRoutes from "../routes/AdminRoutes";
import cors from "cors";
import { metricsMiddleware, portfolioMetrics } from "../middleware/metrics";
import AnalyticsRoutes from "../routes/AnalyticsRoutes";
import BlogRoutes from "../routes/BlogRoutes";
import ProjectRoutes from "../routes/ProjectRoutes";
const app = express();
app.use(express.json());

// Add metrics middleware before other middleware
app.use(metricsMiddleware);


const corsOptions = {
  origin: "https://rohitdhawadkar.in",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// Metrics endpoint (JSON format)
app.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = portfolioMetrics.getMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to retrieve metrics' });
  }
});

// Prometheus format metrics (if you want to use Prometheus later)
app.get('/metrics/prometheus', (req: Request, res: Response) => {
  try {
    res.set('Content-Type', 'text/plain');
    res.send(portfolioMetrics.getPrometheusFormat());
  } catch (error) {
    console.error('Prometheus metrics error:', error);
    res.status(500).send('Failed to retrieve metrics');
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});




app.use("/api/admin", AdminRoutes);
app.use("/api/analytics", AnalyticsRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/projects", ProjectRoutes);


app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
  console.log(`Metrics available at http://localhost:3000/metrics`);
  console.log(`Health check at http://localhost:3000/health`);
});
