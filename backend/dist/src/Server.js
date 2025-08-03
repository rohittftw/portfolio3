"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Added NextFunction
const AdminRoutes_1 = __importDefault(require("../routes/AdminRoutes"));
const metrics_1 = require("../middleware/metrics");
const AnalyticsRoutes_1 = __importDefault(require("../routes/AnalyticsRoutes"));
const BlogRoutes_1 = __importDefault(require("../routes/BlogRoutes"));
const ProjectRoutes_1 = __importDefault(require("../routes/ProjectRoutes"));
const app = (0, express_1.default)();
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
        }
        catch {
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
app.use(express_1.default.json());
app.use(metrics_1.metricsMiddleware);
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
