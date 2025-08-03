import express, { Request, Response, NextFunction } from "express"; // Added NextFunction
import AdminRoutes from "../routes/AdminRoutes";
import { metricsMiddleware, portfolioMetrics } from "../middleware/metrics";
import AnalyticsRoutes from "../routes/AnalyticsRoutes";
import BlogRoutes from "../routes/BlogRoutes";
import ProjectRoutes from "../routes/ProjectRoutes";

const app = express();


const allowedOrigins = [
  'https://rohitdhawadkar.in'
];


app.use((req, res, next) => {
  const origin = req.headers.origin;


  console.log('Incoming origin:', origin);

  if (origin && allowedOrigins.some(allowed => {
    try {
      const url = new URL(origin);
      return allowedOrigins.includes(url.origin);
    } catch {
      return false;
    }
  })) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin'); // Important for caching
  }
  next();
});


app.options(/^\/(api\/.*)?$/, (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'false');
  }
  res.sendStatus(204);
});

app.use(express.json());
app.use(metricsMiddleware);


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


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
