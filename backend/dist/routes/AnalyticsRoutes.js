"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const metrics_1 = require("../middleware/metrics");
const router = express_1.default.Router();
// Get all analytics data
router.get('/', (req, res) => {
    try {
        const metrics = metrics_1.portfolioMetrics.getMetrics();
        res.json(metrics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
});
// Track page views
router.post('/pageview', (req, res) => {
    const { page } = req.body;
    if (page) {
        metrics_1.portfolioMetrics.recordPageView(page);
        res.status(200).json({ success: true });
    }
    else {
        res.status(400).json({ error: 'Page parameter required' });
    }
});
// Track blog views
router.post('/blog-view', (req, res) => {
    const { blogId, blogTitle } = req.body;
    if (blogId && blogTitle) {
        metrics_1.portfolioMetrics.recordBlogView(blogId, blogTitle);
        res.status(200).json({ success: true });
    }
    else {
        res.status(400).json({ error: 'Blog ID and title required' });
    }
});
// Track project views
router.post('/project-view', (req, res) => {
    const { projectId, projectName } = req.body;
    if (projectId && projectName) {
        metrics_1.portfolioMetrics.recordProjectView(projectId, projectName);
        res.status(200).json({ success: true });
    }
    else {
        res.status(400).json({ error: 'Project ID and name required' });
    }
});
exports.default = router;
