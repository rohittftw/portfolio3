"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminRoutes_1 = __importDefault(require("../routes/AdminRoutes"));
const cors_1 = __importDefault(require("cors"));
const metrics_1 = require("../middleware/metrics");
const AnalyticsRoutes_1 = __importDefault(require("../routes/AnalyticsRoutes"));
const BlogRoutes_1 = __importDefault(require("../routes/BlogRoutes"));
const ProjectRoutes_1 = __importDefault(require("../routes/ProjectRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Add metrics middleware before other middleware
app.use(metrics_1.metricsMiddleware);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Metrics endpoint (JSON format)
app.get('/metrics', (req, res) => {
    try {
        const metrics = metrics_1.portfolioMetrics.getMetrics();
        res.json(metrics);
    }
    catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to retrieve metrics' });
    }
});
// Prometheus format metrics (if you want to use Prometheus later)
app.get('/metrics/prometheus', (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        res.send(metrics_1.portfolioMetrics.getPrometheusFormat());
    }
    catch (error) {
        console.error('Prometheus metrics error:', error);
        res.status(500).send('Failed to retrieve metrics');
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/analytics", AnalyticsRoutes_1.default);
app.use("/api/blogs", BlogRoutes_1.default);
app.use("/api/projects", ProjectRoutes_1.default);
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
    console.log(`Metrics available at http://localhost:3000/metrics`);
    console.log(`Health check at http://localhost:3000/health`);
});
