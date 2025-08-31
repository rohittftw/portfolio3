"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const AdminRoutes_1 = __importDefault(require("../routes/AdminRoutes"));
const metrics_1 = require("../middleware/metrics");
const AnalyticsRoutes_1 = __importDefault(require("../routes/AnalyticsRoutes"));
const BlogRoutes_1 = __importDefault(require("../routes/BlogRoutes"));
const ProjectRoutes_1 = __importDefault(require("../routes/ProjectRoutes"));
const app = (0, express_1.default)();
// CORS configuration
const allowedOrigins = [
    'https://rohitdhawadkar.in',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];
// Use the cors middleware (this handles OPTIONS automatically)
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            console.log('Blocked origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));
// Parse JSON bodies
app.use(express_1.default.json());
// Add metrics middleware
app.use(metrics_1.metricsMiddleware);
// Routes
app.get("/metrics", (req, res) => {
    try {
        res.json(metrics_1.portfolioMetrics.getMetrics());
    }
    catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to retrieve metrics' });
    }
});
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/analytics", AnalyticsRoutes_1.default);
app.use("/api/blogs", BlogRoutes_1.default);
app.use("/api/projects", ProjectRoutes_1.default);
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});
