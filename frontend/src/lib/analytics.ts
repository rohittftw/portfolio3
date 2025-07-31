// Analytics utility for tracking portfolio metrics
export class PortfolioAnalytics {
  private static instance: PortfolioAnalytics;
  private baseUrl = 'http://localhost:3000';

  private constructor() {}

  static getInstance(): PortfolioAnalytics {
    if (!PortfolioAnalytics.instance) {
      PortfolioAnalytics.instance = new PortfolioAnalytics();
    }
    return PortfolioAnalytics.instance;
  }

  // Track page views
  async trackPageView(page: string) {
    try {
      await fetch(`${this.baseUrl}/api/analytics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page })
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  // Track blog views
  async trackBlogView(blogId: string, blogTitle: string) {
    try {
      await fetch(`${this.baseUrl}/api/analytics/blog-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, blogTitle })
      });
    } catch (error) {
      console.error('Blog analytics tracking error:', error);
    }
  }

  // Track project views
  async trackProjectView(projectId: string, projectName: string) {
    try {
      await fetch(`${this.baseUrl}/api/analytics/project-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, projectName })
      });
    } catch (error) {
      console.error('Project analytics tracking error:', error);
    }
  }
}

export const analytics = PortfolioAnalytics.getInstance();
