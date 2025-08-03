import express from "express";
import { Request, Response } from "express";
import { portfolioMetrics } from "../middleware/metrics";

const router = express.Router();

// Get all analytics data
router.get("/", (req: Request, res: Response) => {
  try {
    const metrics = portfolioMetrics.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// Track page views
router.post("/pageview", (req: Request, res: Response) => {
  const { page } = req.body;
  if (page) {
    portfolioMetrics.recordPageView(page);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'Page parameter required' });
  }
});

// Track blog views
router.post("/blog-view", (req: Request, res: Response) => {
  const { blogId, blogTitle } = req.body;
  if (blogId && blogTitle) {
    portfolioMetrics.recordBlogView(blogId, blogTitle);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'Blog ID and title required' });
  }
});

// Track project views
router.post("/project-view", (req: Request, res: Response) => {
  const { projectId, projectName } = req.body;
  if (projectId && projectName) {
    portfolioMetrics.recordProjectView(projectId, projectName);
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ error: 'Project ID and name required' });
  }
});

export default router;
