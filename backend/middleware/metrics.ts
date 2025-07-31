import { Request, Response, NextFunction } from 'express';

// Simple in-memory metrics storage
class PortfolioMetrics {
  private static instance: PortfolioMetrics;
  private startTime: number = Date.now();

  // Metrics storage
  private httpRequestsTotal: number = 0;
  private adminLoginAttempts: { success: number; failure: number } = { success: 0, failure: 0 };
  private pageViews: Map<string, number> = new Map();
  private blogViews: Map<string, { count: number; title: string }> = new Map();
  private projectViews: Map<string, { count: number; name: string }> = new Map();
  private responseTimes: number[] = [];
  private activeUsers: number = 0;

  private constructor() {}

  static getInstance(): PortfolioMetrics {
    if (!PortfolioMetrics.instance) {
      PortfolioMetrics.instance = new PortfolioMetrics();
    }
    return PortfolioMetrics.instance;
  }

  // HTTP Request tracking
  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal++;
  }

  // Login attempt tracking
  recordLoginAttempt(success: boolean) {
    if (success) {
      this.adminLoginAttempts.success++;
    } else {
      this.adminLoginAttempts.failure++;
    }
  }

  // Page view tracking
  recordPageView(page: string) {
    const current = this.pageViews.get(page) || 0;
    this.pageViews.set(page, current + 1);
  }

  // Blog view tracking
  recordBlogView(blogId: string, title: string) {
    const current = this.blogViews.get(blogId) || { count: 0, title };
    this.blogViews.set(blogId, { count: current.count + 1, title });
  }

  // Project view tracking
  recordProjectView(projectId: string, name: string) {
    const current = this.projectViews.get(projectId) || { count: 0, name };
    this.projectViews.set(projectId, { count: current.count + 1, name });
  }

  // Response time tracking
  recordResponseTime(time: number) {
    this.responseTimes.push(time);
    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }
  }

  // Get all metrics in a format suitable for export
  getMetrics() {
    const avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0;

    return {
      uptime_seconds: Math.floor((Date.now() - this.startTime) / 1000),
      http_requests_total: this.httpRequestsTotal,
      admin_login_attempts: this.adminLoginAttempts,
      page_views: Object.fromEntries(this.pageViews),
      blog_views: Object.fromEntries(this.blogViews),
      project_views: Object.fromEntries(this.projectViews),
      average_response_time_ms: Math.round(avgResponseTime),
      active_users: this.activeUsers,
      timestamp: new Date().toISOString()
    };
  }

  // Get metrics in Prometheus format (optional)
  getPrometheusFormat(): string {
    const metrics = this.getMetrics();
    let output = '';

    output += `# HELP portfolio_http_requests_total Total HTTP requests\n`;
    output += `# TYPE portfolio_http_requests_total counter\n`;
    output += `portfolio_http_requests_total ${metrics.http_requests_total}\n\n`;

    output += `# HELP portfolio_admin_login_success_total Successful admin logins\n`;
    output += `# TYPE portfolio_admin_login_success_total counter\n`;
    output += `portfolio_admin_login_success_total ${metrics.admin_login_attempts.success}\n\n`;

    output += `# HELP portfolio_admin_login_failure_total Failed admin logins\n`;
    output += `# TYPE portfolio_admin_login_failure_total counter\n`;
    output += `portfolio_admin_login_failure_total ${metrics.admin_login_attempts.failure}\n\n`;

    return output;
  }
}

// Export singleton instance
export const portfolioMetrics = PortfolioMetrics.getInstance();

// Simple middleware that works with Express 5
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Use the 'finish' event instead of overriding res.end
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    portfolioMetrics.incrementHttpRequests(req.method, route, res.statusCode);
    portfolioMetrics.recordResponseTime(duration);
  });

  next();
};
